/**
 * EventListener.ts
 * 职责：监听游戏事件，触发连锁采集
 * 使用 beforeEvents 获取方块破坏前的原始类型
 */
import { world, system } from '@minecraft/server';
import { VeinMinerController } from './VeinMinerController';
import { ToolClassifier } from '../../lib/core/ToolClassifier';
import { Logger } from '../../utils/Logger';
export class EventListener {
    static initialized = false;
    static register() {
        if (this.initialized) {
            Logger.warn('EventListener 已注册，跳过');
            return;
        }
        this.initialized = true;
        // 【关键修复】使用 beforeEvents —— 此时方块尚未被破坏，typeId 仍然正确
        world.beforeEvents.playerBreakBlock.subscribe(this.onBlockBreak.bind(this));
        Logger.info('EventListener 已注册 (beforeEvents.playerBreakBlock)');
    }
    static onBlockBreak(event) {
        try {
            const player = event.player;
            if (!player.isSneaking)
                return;
            // 【关键】在 beforeEvents 中 block 仍然是原始方块
            const block = event.block;
            const originalTypeId = block.typeId;
            const location = {
                x: Math.floor(block.location.x),
                y: Math.floor(block.location.y),
                z: Math.floor(block.location.z)
            };
            const dimension = block.dimension;
            Logger.debug(`[Event] 玩家 ${player.name} 潜行破坏 ${originalTypeId} @ (${location.x}, ${location.y}, ${location.z})`);
            const controller = VeinMinerController.getInstance();
            const tool = ToolClassifier.classify(player);
            // 不取消事件 —— 让原始方块正常破坏
            // 下一 tick 执行 BFS（原始方块已变空气，但我们已记录类型）
            system.run(() => {
                controller.tryStart({
                    player,
                    startTypeId: originalTypeId,
                    startLocation: location,
                    startDimension: dimension,
                    tool: tool.type,
                    tier: tool.tier
                });
            });
        }
        catch (err) {
            Logger.error('onBlockBreak 处理失败', err);
        }
    }
}
