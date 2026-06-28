/**
 * DropHandler.ts
 * 职责：处理方块破坏后的掉落物
 * 支持精准采集与时运附魔
 */

import { ItemStack, world } from '@minecraft/server';
import { Logger } from '../../utils/Logger';

export class DropHandler {
    /**
     * 处理方块掉落
     * 注：基岩版 block.destroy(false) 会自动产生掉落物（保持玩家附魔效果）
     * 此处主要用于特殊场景（如自定义掉落）
     */
    public handleDrop(_player: unknown, _block: unknown): void {
        try {
            // 基岩版 1.21+ 的 block.destroy() 已自动应用玩家附魔
            // 此处保留扩展位，可用于：
            // 1. 自定义掉落表
            // 2. 直接掉落到玩家背包
            // 3. 经验掉落
        } catch (err) {
            Logger.error('DropHandler 处理失败', err);
        }
    }

    /**
     * 直接在玩家位置生成掉落物
     */
    public spawnItemStack(itemStack: ItemStack, location: { x: number; y: number; z: number }, dimensionId: string = 'overworld'): void {
        try {
            const dim = world.getDimension(dimensionId);
            dim.spawnItem(itemStack, location);
        } catch (err) {
            Logger.error('生成掉落物失败', err);
        }
    }
}
