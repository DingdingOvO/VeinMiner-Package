/**
 * EnchantmentReader.ts
 * 职责：读取物品附魔信息（精准采集、时运、耐久、经验修补等）
 */

import { ItemStack } from '@minecraft/server';
import { Logger } from '../../utils/Logger';

/** 附魔信息 */
export interface EnchantmentInfo {
    type: string;
    level: number;
}

export class EnchantmentReader {
    /**
     * 获取物品上的所有附魔
     */
    public static getAll(item: ItemStack): EnchantmentInfo[] {
        try {
            const comp = item.getComponent('minecraft:enchantable');
            if (!comp) return [];
            const enchs = comp.getEnchantments();
            return enchs.map(e => ({ type: e.type.id, level: e.level }));
        } catch (err) {
            Logger.error('EnchantmentReader.getAll 失败', err);
            return [];
        }
    }

    /**
     * 获取指定附魔的等级
     */
    public static getLevel(item: ItemStack, enchantmentId: string): number {
        const all = this.getAll(item);
        const found = all.find(e => e.type === enchantmentId || e.type.endsWith(`:${enchantmentId}`));
        return found?.level ?? 0;
    }

    /**
     * 是否有精准采集
     */
    public static hasSilkTouch(item: ItemStack): boolean {
        return this.getLevel(item, 'silk_touch') > 0;
    }

    /**
     * 是否有时运
     */
    public static getFortuneLevel(item: ItemStack): number {
        return this.getLevel(item, 'fortune');
    }

    /**
     * 是否有耐久附魔
     */
    public static getUnbreakingLevel(item: ItemStack): number {
        return this.getLevel(item, 'unbreaking');
    }
}
