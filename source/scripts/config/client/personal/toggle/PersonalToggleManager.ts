/**
 * PersonalToggleManager.ts
 * 职责：个人开关管理器
 */

import { Player } from '@minecraft/server';
import { PersonalToggleStorage } from './PersonalToggleStorage';

export class PersonalToggleManager {
    private storage = new PersonalToggleStorage();

    public get(player: Player): boolean {
        return this.storage.get(player);
    }

    public set(player: Player, value: boolean): void {
        this.storage.set(player, value);
    }

    public toggle(player: Player): boolean {
        return this.storage.toggle(player);
    }

    public reset(player: Player): void {
        this.storage.reset(player);
    }
}
