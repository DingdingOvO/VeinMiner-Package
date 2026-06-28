/**
 * PersonalSpecialOverrideManager.ts
 * 职责：个人特殊规则覆盖管理器
 */
import { PersonalSpecialOverrideStorage } from './PersonalSpecialOverrideStorage';
import { SPECIAL_RULES } from '../../../../config/shared/specialrules/index.js';
export class PersonalSpecialOverrideManager {
    storage = new PersonalSpecialOverrideStorage();
    /**
     * 获取某规则的最终启用状态（共享默认 → 个人覆盖）
     */
    getEffective(player, key) {
        const shared = SPECIAL_RULES[key]?.enabled ?? false;
        const override = this.storage.getRule(player, key);
        return override ?? shared;
    }
    set(player, key, value) {
        this.storage.set(player, key, value);
    }
    getAll(player) {
        return this.storage.get(player);
    }
    reset(player) {
        this.storage.reset(player);
    }
}
