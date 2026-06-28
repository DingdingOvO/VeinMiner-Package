/**
 * VeinMinerController.js ★ 核心：连锁采集主控制器 ★
 *
 * 逻辑：
 *   - 空手 → 白名单中的徒手可破坏方块也能连锁
 *   - 有工具 → 连锁，工具越好速度越快，消耗耐久
 *   - 所有方块在一个 tick 内全部破坏（瞬间连锁）
 *   - 掉落物集中到挖掘位置（可关闭）
 */
import { world, system } from '@minecraft/server';
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
            this.startTask(player, startTypeId, startLocation, startDimension, isHand);
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
    startTask(player, startTypeId, startLocation, dimension, isHand) {
        PerformanceGuard.taskStarted();
        this.playerTasks.start(player);
        const maxVein = this.registry.getEffectiveMaxVein(player, startTypeId, dimension.id);
        const isLog = LOG_IDS.has(startTypeId);
        Logger.debug(`[Controller] BFS: type=${startTypeId}, max=${maxVein}, hand=${isHand}, tree=${isLog}`);
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
        Logger.debug(`[Controller] 找到: 原木${toBreak.length} + 树叶${leafBlocks.length} = ${totalCount}`);
        // 按距离排序，树叶放最后
        const sorted = sortByDistance(toBreak, startLocation);
        const sortedLeaves = sortByDistance(leafBlocks, startLocation);
        // ★ 一个 tick 内全部破坏 ★
        system.run(() => {
            let broken = 0;
            for (const pos of [...sorted, ...sortedLeaves]) {
                if (!isHand) {
                    const durResult = DurabilityManager.consume(player, 1);
                    if (!durResult.success || durResult.broken) {
                        this.feedback.warn(player, 'veinminer.msg.limitReached');
                        break;
                    }
                }
                try {
                    dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air destroy`);
                    broken++;
                } catch (e) { }
                PerformanceGuard.recordBlockBreak();
            }
            // 掉落物集中
            this.tryCollectDrops(player, dimension, [...sorted, ...sortedLeaves], startLocation);
            // 反馈
            if (broken > 0) {
                this.feedback.info(player, 'veinminer.msg.complete', broken);
            }
            PerformanceGuard.taskFinished();
            this.playerTasks.finish(player);
        });
    }
    /** 尝试将掉落物集中到挖掘位置 */
    tryCollectDrops(player, dimension, brokenBlocks, target) {
        try {
            const enabled = player.getDynamicProperty('veinminer:collect_drops');
            if (enabled === false) return; // 默认 true (undefined → 开启)
        } catch { }
        // 下一 tick 收集（等物品生成）
        system.run(() => {
            try {
                let maxDist = 5;
                for (const pos of brokenBlocks) {
                    const dx = pos.x - target.x;
                    const dy = pos.y - target.y;
                    const dz = pos.z - target.z;
                    maxDist = Math.max(maxDist, Math.sqrt(dx * dx + dy * dy + dz * dz) + 3);
                }
                const items = dimension.getEntities({
                    location: target,
                    maxDistance: maxDist,
                    type: 'minecraft:item'
                });
                for (const item of items) {
                    try { item.teleport(target, { keepVelocity: false }); } catch (e) { }
                }
            } catch (e) { }
        });
    }
}