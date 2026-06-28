/**
 * PersonalMaxVeinManager.ts
 * 职责：个人最大连锁数管理器
 */

import { Player } from '@minecraft/server';
import { PersonalMaxVeinStorage } from './PersonalMaxVeinStorage';
import { MAX_VEIN_DEFAULT } from '../../../../config/shared/performance/MaxVeinDefault';

export class PersonalMaxVeinManager {
    private storage = new PersonalMaxVeinStorage();

    /**
     * 获取有效最大连锁数 = min(个人设置, 共享默认上限)
     */
    public getEffective(player: Player): number {
        const personal = this.storage.get(player);
        return Math.min(personal, MAX_VEIN_DEFAULT);
    }

    public get(player: Player): number {
        return this.storage.get(player);
    }

    public set(player: Player, value: number): void {
        this.storage.set(player, value);
    }

    public reset(player: Player): void {
        this.storage.reset(player);
    }
}
