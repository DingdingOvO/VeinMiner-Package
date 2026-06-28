/**
 * VeinMinerController.js ★ 核心：连锁采集主控制器 ★
 *
 * 逻辑（与原版 VeinMiner 一致）：
 *   - 空手 → 白名单中的徒手可破坏方块（木头、泥土等）也能连锁，速度 1 块/tick
 *   - 有工具 → 连锁，工具越好速度越快，消耗耐久
 */
import { system } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { ToolType } from '../../lib/core/ToolClassifier';
import { bfsScan, sortByDistance, scanLeaves } from '../../lib/core/BFSAlgorithm';
import { DurabilityManager } from '../../lib/core/DurabilityManager';
import { FeedbackHandler } from '../handlers/FeedbackHandler';
import { PerformanceGuard } from '../../utils/PerformanceGuard';
import { GlobalRateLimiter } from './GlobalRateLimiter';
import { PlayerTaskManager } from './PlayerTaskManager';
import { Logger } from '../../utils/Logger';
import { SCAN_TIMEOUT_MS } from '../../config/shared/performance/index.js';

/** 所有原木类型ID集合 */
const LOG_IDS = new Set([
    'minecraft:oak_log', 'minecraft:spruce_log', 'minecraft:birch_log',
    'minecraft:jungle_log', 'minecraft:acacia_log', 'minecraft:dark_oak_log',
    'minecraft:mangrove_log', 'minecraft:cherry_log',
    'minecraft:crimson_stem', 'minecraft:warped_stem'
]);

/** 所有树叶类型ID集合 */
const LEAF_IDS = new Set([
    'minecraft:oak_leaves', 'minecraft:spruce_leaves', 'minecraft:birch_leaves',
    'minecraft:jungle_leaves', 'minecraft:acacia_leaves', 'minecraft:dark_oak_leaves',
    'minecraft:mangrove_leaves', 'minecraft:cherry_leaves',
    'minecraft:azalea_leaves', 'minecraft:azalea_leaves_flowered'
]);

/** 树叶搜索参数 */
const LEAF_SCAN_RADIUS = 4;
const LEAF_MAX_COUNT = 64;

/** 工具等级 → 每tick连锁方块数（遵循原版挖掘速度等级） */
const TIER_SPEED = {
    netherite: 8,
    diamond: 6,
    iron: 4,
    golden: 4,
    stone: 3,
    wooden: 2,
};

function getSpeed(tier, isHand) {
    if (isHand) return 1;
    return TIER_SPEED[tier] ?? 2;
}

export class VeinMinerController {
    static instance;
    registry = ConfigRegistry.getInstance();
    feedback = new FeedbackHandler();
    rateLimiter = new GlobalRateLimiter();
    playerTasks = new PlayerTaskManager();
    constructor() { }
    static getInstance() {
        if (!VeinMinerController.instance) {
            VeinMinerController.instance = new VeinMinerController();
        }
        return VeinMinerController.instance;
    }
    tryStart(request) {
        const { player, startTypeId, startLocation, startDimension, tool, tier } = request;
        try {
            if (!this.registry.getPersonalToggle(player))
                return false;
            const isHand = (tool === ToolType.NONE);
            if (!this.checkBlockAllowed(startTypeId, player, startDimension.id))
                return false;
            if (!PerformanceGuard.canStartNewTask()) {
                this.feedback.warn(player, 'veinminer.msg.serverBusy');
                return false;
            }
            if (!this.rateLimiter.tryAcquire()) {
                this.feedback.warn(player, 'veinminer.msg.serverBusy');
                return false;
            }
            if (!this.playerTasks.canStart(player))
                return false;
            this.startTask(player, startTypeId, startLocation, startDimension, getSpeed(tier, isHand), isHand);
            return true;
        }
        catch (err) {
            Logger.error('连锁采集启动失败', err);
            return false;
        }
    }
    checkBlockAllowed(blockId, player, dimensionId) {
        if (this.registry.isBlacklisted(blockId))
            return false;
        const whitelist = this.registry.getEffectiveWhitelist(player);
        if (!whitelist.includes(blockId))
            return false;
        const dimConfig = this.registry.getDimensionConfig(dimensionId);
        if (!dimConfig.enabled) {
            this.feedback.warn(player, 'veinminer.msg.dimensionDisabled');
            return false;
        }
        return true;
    }
    startTask(player, startTypeId, startLocation, dimension, speed, isHand) {
        PerformanceGuard.taskStarted();
        this.playerTasks.start(player);
        const maxVein = this.registry.getEffectiveMaxVein(player, startTypeId, dimension.id);
        const isLog = LOG_IDS.has(startTypeId);
        Logger.debug(`[Controller] BFS 开始: type=${startTypeId}, max=${maxVein}, speed=${speed}/tick, hand=${isHand}, treeMode=${isLog}, pos=(${startLocation.x},${startLocation.y},${startLocation.z})`);
        // 原木用26面BFS（覆盖金合欢斜向），其他用6面
        const scanResult = bfsScan(dimension, startLocation, {
            maxBlocks: maxVein,
            timeoutMs: SCAN_TIMEOUT_MS,
            targetTypeId: startTypeId,
            use26: isLog
        });
        if (scanResult.timedOut) {
            this.feedback.warn(player, 'veinminer.msg.scanTimeout');
            PerformanceGuard.taskFinished();
            this.playerTasks.finish(player);
            return;
        }
        let toBreak = scanResult.blocks.length > 1 ? scanResult.blocks.slice(1) : [];
        // 树木模式：自动带树叶
        let leafBlocks = [];
        if (isLog && scanResult.blocks.length >= 1) {
            leafBlocks = scanLeaves(dimension, scanResult.blocks, LEAF_IDS, LEAF_SCAN_RADIUS, LEAF_MAX_COUNT);
        }
        if (toBreak.length === 0 && leafBlocks.length === 0) {
            PerformanceGuard.taskFinished();
            this.playerTasks.finish(player);
            return;
        }
        const totalCount = toBreak.length + leafBlocks.length;
        Logger.debug(`[Controller] BFS 完成: 原木 ${toBreak.length} + 树叶 ${leafBlocks.length} = ${totalCount}, 耗时 ${scanResult.elapsedMs}ms`);
        // 原木按距离排序，树叶放最后
        const sorted = sortByDistance(toBreak, startLocation);
        const sortedLeaves = sortByDistance(leafBlocks, startLocation);
        this.scheduleDestruction(player, [...sorted, ...sortedLeaves], dimension, speed, isHand);
    }
    scheduleDestruction(player, blocks, dimension, speed, isHand) {
        let index = 0;
        const total = blocks.length;
        const tick = () => {
            try {
                if (index >= total) {
                    PerformanceGuard.taskFinished();
                    this.playerTasks.finish(player);
                    this.feedback.info(player, 'veinminer.msg.complete', total);
                    Logger.debug(`[Controller] 连锁采集完成: ${total} 个方块`);
                    return;
                }
                for (let i = 0; i < speed && index < total; i++, index++) {
                    const pos = blocks[index];
                    // 空手不消耗耐久，有工具才检查耐久
                    if (!isHand) {
                        const durResult = DurabilityManager.consume(player, 1);
                        if (!durResult.success || durResult.broken === true) {
                            this.feedback.warn(player, 'veinminer.msg.limitReached');
                            PerformanceGuard.taskFinished();
                            this.playerTasks.finish(player);
                            return;
                        }
                    }
                    try {
                        dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air destroy`);
                    }
                    catch (e) {
                        // ignore
                    }
                    PerformanceGuard.recordBlockBreak();
                }
                system.run(tick);
            }
            catch (err) {
                Logger.error('分帧破坏失败', err);
                PerformanceGuard.taskFinished();
                this.playerTasks.finish(player);
            }
        };
        system.run(tick);
    }
}