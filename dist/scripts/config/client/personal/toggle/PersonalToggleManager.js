/**
 * PersonalToggleManager.ts
 * 职责：个人开关管理器
 */
import { PersonalToggleStorage } from './PersonalToggleStorage';
export class PersonalToggleManager {
    storage = new PersonalToggleStorage();
    get(player) {
        return this.storage.get(player);
    }
    set(player, value) {
        this.storage.set(player, value);
    }
    toggle(player) {
        return this.storage.toggle(player);
    }
    reset(player) {
        this.storage.reset(player);
    }
}
