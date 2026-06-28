/**
 * PersonalMaxVeinStorage.ts
 * 职责：玩家个人最大连锁数存储
 */
import { DynamicPropertyAdapter } from '../../../../data/storage/DynamicPropertyAdapter';
import { Logger } from '../../../../utils/Logger';
import { MAX_VEIN_DEFAULT } from '../../../../config/shared/performance/MaxVeinDefault';
const PROPERTY_KEY = 'veinminer:personal_maxvein';
export class PersonalMaxVeinStorage {
    adapter = new DynamicPropertyAdapter(PROPERTY_KEY);
    /**
     * 获取玩家个人最大连锁数（无设置则返回默认）
     */
    get(player) {
        try {
            return this.adapter.getForPlayer(player) ?? MAX_VEIN_DEFAULT;
        }
        catch (err) {
            Logger.error('读取个人最大连锁数失败', err);
            return MAX_VEIN_DEFAULT;
        }
    }
    /**
     * 设置玩家个人最大连锁数
     */
    set(player, value) {
        const clamped = Math.max(1, Math.min(128, Math.floor(value)));
        this.adapter.setForPlayer(player, clamped);
    }
    /**
     * 重置为默认
     */
    reset(player) {
        this.adapter.setForPlayer(player, MAX_VEIN_DEFAULT);
    }
}
