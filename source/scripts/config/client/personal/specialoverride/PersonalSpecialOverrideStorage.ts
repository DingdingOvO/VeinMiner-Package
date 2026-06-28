/**
 * PersonalSpecialOverrideStorage.ts
 * 职责：玩家个人特殊规则覆盖存储
 * 例如：玩家可选择关闭树叶/作物连锁
 */

import { Player } from '@minecraft/server';
import { DynamicPropertyAdapter } from '../../../../data/storage/DynamicPropertyAdapter';
import { Logger } from '../../../../utils/Logger';

const PROPERTY_KEY = 'veinminer:personal_specialoverride';

/** 特殊规则覆盖键 */
export type SpecialRuleKey = 'leaf' | 'crop' | 'obsidian' | 'vines' | 'mushroom';

export type SpecialOverrideMap = Partial<Record<SpecialRuleKey, boolean>>;

export class PersonalSpecialOverrideStorage {
    private adapter = new DynamicPropertyAdapter<SpecialOverrideMap>(PROPERTY_KEY);

    public get(player: Player): SpecialOverrideMap {
        try {
            return this.adapter.getForPlayer(player) ?? {};
        } catch (err) {
            Logger.error('读取个人特殊规则覆盖失败', err);
            return {};
        }
    }

    public set(player: Player, key: SpecialRuleKey, value: boolean): void {
        const map = this.get(player);
        map[key] = value;
        this.adapter.setForPlayer(player, map);
    }

    public getRule(player: Player, key: SpecialRuleKey): boolean | undefined {
        return this.get(player)[key];
    }

    public reset(player: Player): void {
        this.adapter.setForPlayer(player, {});
    }
}
