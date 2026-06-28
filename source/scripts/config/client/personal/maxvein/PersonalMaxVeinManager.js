/**
 * PersonalMaxVeinManager.ts
 * 职责：个人最大连锁数管理器
 */
import { PersonalMaxVeinStorage } from './PersonalMaxVeinStorage';
import { MAX_VEIN_DEFAULT } from '../../../../config/shared/performance/MaxVeinDefault';
export class PersonalMaxVeinManager {
    storage = new PersonalMaxVeinStorage();
    /**
     * 获取有效最大连锁数 = min(个人设置, 共享默认上限)
     */
    getEffective(player) {
        const personal = this.storage.get(player);
        return Math.min(personal, MAX_VEIN_DEFAULT);
    }
    get(player) {
        return this.storage.get(player);
    }
    set(player, value) {
        this.storage.set(player, value);
    }
    reset(player) {
        this.storage.reset(player);
    }
}
