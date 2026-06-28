/**
 * PersonalToggleStorage.ts
 * 职责：玩家个人开关存储
 */
import { DynamicPropertyAdapter } from '../../../../data/storage/DynamicPropertyAdapter';
import { Logger } from '../../../../utils/Logger';
const PROPERTY_KEY = 'veinminer:personal_toggle';
export class PersonalToggleStorage {
    adapter = new DynamicPropertyAdapter(PROPERTY_KEY);
    /**
     * 获取开关状态（默认开启）
     */
    get(player) {
        try {
            return this.adapter.getForPlayer(player) ?? true;
        }
        catch (err) {
            Logger.error('读取个人开关失败', err);
            return true;
        }
    }
    /**
     * 设置开关
     */
    set(player, value) {
        this.adapter.setForPlayer(player, value);
    }
    /**
     * 切换开关
     */
    toggle(player) {
        const next = !this.get(player);
        this.set(player, next);
        return next;
    }
    /**
     * 重置为默认（开启）
     */
    reset(player) {
        this.adapter.setForPlayer(player, true);
    }
}
