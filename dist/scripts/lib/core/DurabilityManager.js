/**
 * DurabilityManager.ts
 * 职责：管理工具耐久度，每次连锁破坏消耗耐久
 * 支持精准采集、时运等附魔的耐久折扣
 */
import { EnchantmentReader } from './EnchantmentReader';
import { Logger } from '../../utils/Logger';
export class DurabilityManager {
    /** 每块默认消耗 */
    static DEFAULT_COST = 1;
    /**
     * 消耗工具耐久
     * @param player 玩家
     * @param count 消耗数量
     * @returns 消耗结果
     */
    static consume(player, count) {
        try {
            const equippable = player.getComponent('minecraft:equippable');
            if (!equippable) {
                return { success: false, consumed: 0, broken: false };
            }
            const slot = equippable.getEquipmentSlot('Mainhand');
            const item = slot?.getItem?.();
            if (!item) {
                return { success: false, consumed: 0, broken: false };
            }
            const durability = item.getComponent('minecraft:durability');
            if (!durability) {
                // 无耐久组件（如鞘），直接返回成功
                return { success: true, consumed: 0, broken: false };
            }
            // 应用耐久附魔折扣
            const unbreakingLevel = EnchantmentReader.getLevel(item, 'unbreaking');
            let totalCost = 0;
            for (let i = 0; i < count; i++) {
                // 耐久附魔：每个等级 100/(level+1) % 概率不消耗
                if (unbreakingLevel > 0 && Math.random() < (unbreakingLevel / (unbreakingLevel + 1))) {
                    continue;
                }
                totalCost++;
            }
            const maxDurability = durability.maxDurability;
            const currentDamage = durability.damage;
            const remaining = maxDurability - currentDamage;
            if (remaining <= 0) {
                return { success: false, consumed: 0, broken: true };
            }
            const actualCost = Math.min(totalCost, remaining);
            durability.damage = currentDamage + actualCost;
            slot?.setItem?.(item);
            const broken = durability.damage >= maxDurability;
            return {
                success: true,
                consumed: actualCost,
                broken
            };
        }
        catch (err) {
            Logger.error('DurabilityManager.consume 失败', err);
            return { success: false, consumed: 0, broken: false };
        }
    }
    /**
     * 检查工具剩余耐久是否足够
     */
    static hasEnough(player, required) {
        try {
            const equippable = player.getComponent('minecraft:equippable');
            if (!equippable)
                return false;
            const slot = equippable.getEquipmentSlot('Mainhand');
            const item = slot?.getItem?.();
            if (!item)
                return false;
            const durability = item.getComponent('minecraft:durability');
            if (!durability)
                return true;
            return (durability.maxDurability - durability.damage) >= required;
        }
        catch {
            return false;
        }
    }
}
