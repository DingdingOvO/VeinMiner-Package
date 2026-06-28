/**
 * PersonalMaxVeinStorage.ts
 * 职责：玩家个人最大连锁数存储
 */

import { Player } from '@minecraft/server';
import { DynamicPropertyAdapter } from '../../../../data/storage/DynamicPropertyAdapter';
import { Logger } from '../../../../utils/Logger';
import { MAX_VEIN_DEFAULT } from '../../../../config/shared/performance/MaxVeinDefault';

const PROPERTY_KEY = 'veinminer:personal_maxvein';

export class PersonalMaxVeinStorage {
    private adapter = new DynamicPropertyAdapter<number>(PROPERTY_KEY);

    /**
     * 获取玩家个人最大连锁数（无设置则返回默认）
     */
    public get(player: Player): number {
        try {
            return this.adapter.getForPlayer(player) ?? MAX_VEIN_DEFAULT;
        } catch (err) {
            Logger.error('读取个人最大连锁数失败', err);
            return MAX_VEIN_DEFAULT;
        }
    }

    /**
     * 设置玩家个人最大连锁数
     */
    public set(player: Player, value: number): void {
        const clamped = Math.max(1, Math.min(128, Math.floor(value)));
        this.adapter.setForPlayer(player, clamped);
    }

    /**
     * 重置为默认
     */
    public reset(player: Player): void {
        this.adapter.setForPlayer(player, MAX_VEIN_DEFAULT);
    }
}
