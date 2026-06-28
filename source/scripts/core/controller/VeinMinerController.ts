/**
 * VeinMinerController.ts ★ 核心：连锁采集主控制器 ★
 *
 * 逻辑（与原版 VeinMiner 一致）：
 *   - 空手 → 白名单中的徒手可破坏方块（木头、泥土等）也能连锁，速度 1 块/tick
 *   - 有工具 → 连锁，工具越好速度越快，消耗耐久
 */

import { Player, system, Dimension, Vector3 } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { ToolType } from '../../lib/core/ToolClassifier';
import { bfsScan, sortByDistance } from '../../lib/core/BFSAlgorithm';
import { DurabilityManager } from '../../lib/core/DurabilityManager';
import { FeedbackHandler } from '../handlers/FeedbackHandler';
import { PerformanceGuard } from '../../utils/PerformanceGuard';
import { GlobalRateLimiter } from './GlobalRateLimiter';
import { PlayerTaskManager } from './PlayerTaskManager';
import { Logger } from '../../utils/Logger';
import { SCAN_TIMEOUT_MS } from '../../config/shared/performance';

/** 工具等级 → 每tick连锁方块数（遵循原版挖掘速度等级） */
const TIER_SPEED: Record<string, number> = {
    netherite: 8,
    diamond: 6,
    iron: 4,
    golden: 4,
    stone: 3,
    wooden: 2,
};

function getSpeed(tier: string | undefined, isHand: boolean): number {
    if (isHand) return 1;
    return (tier && TIER_SPEED[tier]) ?? 2;
}

export interface VeinMineRequest {
    player: Player;
    startTypeId: string;
    startLocation: Vector3;
    startDimension: Dimension;
    tool: ToolType;
    tier?: string;
}

export class VeinMinerController {
    private static instance: VeinMinerController;
    private registry = ConfigRegistry.getInstance();
    private feedback = new FeedbackHandler();
    private rateLimiter = new GlobalRateLimiter();
    private playerTasks = new PlayerTaskManager();

    private constructor() {}

    public static getInstance(): VeinMinerController {
        if (!VeinMinerController.instance) {
            VeinMinerController.instance = new VeinMinerController();
        }
        return VeinMinerController.instance;
    }

    public tryStart(request: VeinMineRequest): boolean {
        const { player, startTypeId, startLocation, startDimension, tool, tier } = request;
        try {
            if (!this.registry.getPersonalToggle(player)) return false;

            const isHand = (tool === ToolType.NONE);

            if (!this.checkBlockAllowed(startTypeId, player, startDimension.id)) return false;
            if (!PerformanceGuard.canStartNewTask()) {
                this.feedback.warn(player, 'veinminer.msg.serverBusy');
                return false;
            }
            if (!this.rateLimiter.tryAcquire()) {
                this.feedback.warn(player, 'veinminer.msg.serverBusy');
                return false;
            }
            if (!this.playerTasks.canStart(player)) return false;

            this.startTask(player, startTypeId, startLocation, startDimension, getSpeed(tier, isHand), isHand);
            return true;
        } catch (err) {
            Logger.error('连锁采集启动失败', err);
            return false;
        }
    }

    private checkBlockAllowed(blockId: string, player: Player, dimensionId: string): boolean {
        if (this.registry.isBlacklisted(blockId)) return false;
        const whitelist = this.registry.getEffectiveWhitelist(player);
        if (!whitelist.includes(blockId)) return false;
        const dimConfig = this.registry.getDimensionConfig(dimensionId);
        if (!dimConfig.enabled) {
            this.feedback.warn(player, 'veinminer.msg.dimensionDisabled');
            return false;
        }
        return true;
    }

    private startTask(player: Player, startTypeId: string, startLocation: Vector3, dimension: Dimension, speed: number, isHand: boolean): void {
        PerformanceGuard.taskStarted();
        this.playerTasks.start(player);
        const maxVein = this.registry.getEffectiveMaxVein(player, startTypeId, dimension.id);

        Logger.debug(`[Controller] BFS 开始: type=${startTypeId}, max=${maxVein}, speed=${speed}/tick, hand=${isHand}, pos=(${startLocation.x},${startLocation.y},${startLocation.z})`);

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
        this.scheduleDestruction(player, sorted, dimension, speed, isHand);
    }

    private scheduleDestruction(player: Player, blocks: { x: number; y: number; z: number }[], dimension: Dimension, speed: number, isHand: boolean): void {
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
                    } catch (e) {
                        // ignore
                    }
                    PerformanceGuard.recordBlockBreak();
                }

                system.run(tick);
            } catch (err) {
                Logger.error('分帧破坏失败', err);
                PerformanceGuard.taskFinished();
                this.playerTasks.finish(player);
            }
        };

        system.run(tick);
    }
}