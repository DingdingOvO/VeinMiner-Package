/**
 * PersonalBlockListManager.ts
 * 职责：个人白名单管理器，对外提供业务接口
 */

import { Player } from '@minecraft/server';
import { PersonalBlockListStorage } from './PersonalBlockListStorage';
import { getAllSharedWhitelist } from '../../../../config/shared/whitelist';
import { CollectionHelper } from '../../../../lib/utils/CollectionHelper';

export class PersonalBlockListManager {
    private storage = new PersonalBlockListStorage();

    /**
     * 获取玩家有效白名单 = 共享默认 + 个人自定义
     */
    public getEffective(player: Player): string[] {
        const shared = getAllSharedWhitelist();
        const personal = this.storage.get(player);
        return CollectionHelper.union(shared, personal);
    }

    /**
     * 添加个人方块
     */
    public add(player: Player, blockId: string): boolean {
        return this.storage.add(player, blockId);
    }

    /**
     * 移除个人方块
     */
    public remove(player: Player, blockId: string): boolean {
        return this.storage.remove(player, blockId);
    }

    /**
     * 列出个人方块（仅个人添加的，不含共享默认）
     */
    public listPersonal(player: Player): string[] {
        return this.storage.get(player);
    }

    /**
     * 重置（清空）
     */
    public reset(player: Player): void {
        this.storage.clear(player);
    }
}
