/**
 * EnchantmentReader.ts
 * 职责：读取物品附魔信息（精准采集、时运、耐久、经验修补等）
 */
import { Logger } from '../../utils/Logger';
export class EnchantmentReader {
    /**
     * 获取物品上的所有附魔
     */
    static getAll(item) {
        try {
            const comp = item.getComponent('minecraft:enchantable');
            if (!comp)
                return [];
            const enchs = comp.getEnchantments();
            return enchs.map(e => ({ type: e.type.id, level: e.level }));
        }
        catch (err) {
            Logger.error('EnchantmentReader.getAll 失败', err);
            return [];
        }
    }
    /**
     * 获取指定附魔的等级
     */
    static getLevel(item, enchantmentId) {
        const all = this.getAll(item);
        const found = all.find(e => e.type === enchantmentId || e.type.endsWith(`:${enchantmentId}`));
        return found?.level ?? 0;
    }
    /**
     * 是否有精准采集
     */
    static hasSilkTouch(item) {
        return this.getLevel(item, 'silk_touch') > 0;
    }
    /**
     * 是否有时运
     */
    static getFortuneLevel(item) {
        return this.getLevel(item, 'fortune');
    }
    /**
     * 是否有耐久附魔
     */
    static getUnbreakingLevel(item) {
        return this.getLevel(item, 'unbreaking');
    }
}
