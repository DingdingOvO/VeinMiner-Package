/**
 * PersonalSpecialOverrideManager.ts
 * 职责：个人特殊规则覆盖管理器
 */

import { Player } from '@minecraft/server';
import { PersonalSpecialOverrideStorage, SpecialRuleKey, SpecialOverrideMap } from './PersonalSpecialOverrideStorage';
import { SPECIAL_RULES } from '../../../../config/shared/specialrules';

export class PersonalSpecialOverrideManager {
    private storage = new PersonalSpecialOverrideStorage();

    /**
     * 获取某规则的最终启用状态（共享默认 → 个人覆盖）
     */
    public getEffective(player: Player, key: SpecialRuleKey): boolean {
        const shared = SPECIAL_RULES[key]?.enabled ?? false;
        const override = this.storage.getRule(player, key);
        return override ?? shared;
    }

    public set(player: Player, key: SpecialRuleKey, value: boolean): void {
        this.storage.set(player, key, value);
    }

    public getAll(player: Player): SpecialOverrideMap {
        return this.storage.get(player);
    }

    public reset(player: Player): void {
        this.storage.reset(player);
    }
}
