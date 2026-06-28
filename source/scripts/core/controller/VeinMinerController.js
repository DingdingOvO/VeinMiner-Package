/**
 * VeinMinerController.ts ★ 核心：连锁采集主控制器 ★
 */
import { system } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { ToolType } from '../../lib/core/ToolClassifier';
import { bfsScan, sortByDistance } from '../../lib/core/BFSAlgorithm';
import { DurabilityManager } from '../../lib/core/DurabilityManager';
import { FeedbackHandler } from '../handlers/FeedbackHandler';
import { PerformanceGuard } from '../../utils/PerformanceGuard';
import { GlobalRateLimiter } from './GlobalRateLimiter';
import { PlayerTaskManager } from './PlayerTaskManager';
import { Logger } from '../../utils/Logger';
import { SCAN_TIMEOUT_MS, BLOCKS_PER_TICK } from '../../config/shared/performance';
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
        const { player, startTypeId, startLocation, startDimension, tool } = request;
        try {
            if (!this.registry.getPersonalToggle(player))
                return false;
            if (tool === ToolType.NONE) {
                this.feedback.warn(player, 'veinminer.msg.toolInvalid');
                return false;
            }
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
            this.startTask(player, startTypeId, startLocation, startDimension);
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
    startTask(player, startTypeId, startLocation, dimension) {
        PerformanceGuard.taskStarted();
        this.playerTasks.start(player);
        const maxVein = this.registry.getEffectiveMaxVein(player, startTypeId, dimension.id);
        Logger.debug(`[Controller] BFS 开始: type=${startTypeId}, max=${maxVein}, pos=(${startLocation.x},${startLocation.y},${startLocation.z})`);
        const scanResult = bfsScan(dimension, startLocation, {
            maxBlocks: maxVein,
            timeoutMs: SCAN_TIMEOUT_MS,
            targetTypeId: startTypeId
        });
        if (scanResult.timedOut) {
            this.feedback.warn(player, 'veinminer.msg.scanTimeout');
            PerformanceGuard.taskFinished();
            this.playerTasks.finish(player);
            return;
        }
        if (scanResult.blocks.length <= 1) {
            PerformanceGuard.taskFinished();
            this.playerTasks.finish(player);
            return;
        }
        const toBreak = scanResult.blocks.slice(1);
        this.feedback.info(player, 'veinminer.msg.connected', toBreak.length);
        Logger.debug(`[Controller] BFS 完成: 找到 ${toBreak.length} 个相连方块, 耗时 ${scanResult.elapsedMs}ms`);
        const sorted = sortByDistance(toBreak, startLocation);
        this.scheduleDestruction(player, sorted, dimension);
    }
    scheduleDestruction(player, blocks, dimension) {
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
                for (let i = 0; i < BLOCKS_PER_TICK && index < total; i++, index++) {
                    const pos = blocks[index];
                    const durResult = DurabilityManager.consume(player, 1);
                    if (!durResult.success || durResult.broken === true) {
                        this.feedback.warn(player, 'veinminer.msg.limitReached');
                        PerformanceGuard.taskFinished();
                        this.playerTasks.finish(player);
                        return;
                    }
                    // 【性能修复】分帧 + 每帧4块，避免单帧阻塞
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
