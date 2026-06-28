/**
 * PersonalSpecialOverrideStorage.ts
 * 职责：玩家个人特殊规则覆盖存储
 * 例如：玩家可选择关闭树叶/作物连锁
 */
import { DynamicPropertyAdapter } from '../../../../data/storage/DynamicPropertyAdapter';
import { Logger } from '../../../../utils/Logger';
const PROPERTY_KEY = 'veinminer:personal_specialoverride';
export class PersonalSpecialOverrideStorage {
    adapter = new DynamicPropertyAdapter(PROPERTY_KEY);
    get(player) {
        try {
            return this.adapter.getForPlayer(player) ?? {};
        }
        catch (err) {
            Logger.error('读取个人特殊规则覆盖失败', err);
            return {};
        }
    }
    set(player, key, value) {
        const map = this.get(player);
        map[key] = value;
        this.adapter.setForPlayer(player, map);
    }
    getRule(player, key) {
        return this.get(player)[key];
    }
    reset(player) {
        this.adapter.setForPlayer(player, {});
    }
}
