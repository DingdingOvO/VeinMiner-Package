/**
 * PersonalBlockListStorage.ts
 * 职责：玩家个人白名单存储（基于 DynamicProperty）
 * 仅客户端模式：每个玩家可自由管理自己的额外白名单
 */
import { DynamicPropertyAdapter } from '../../../../data/storage/DynamicPropertyAdapter';
import { Logger } from '../../../../utils/Logger';
import { CollectionHelper } from '../../../../lib/utils/CollectionHelper';
const PROPERTY_KEY = 'veinminer:personal_blocklist';
export class PersonalBlockListStorage {
    adapter;
    constructor() {
        this.adapter = new DynamicPropertyAdapter(PROPERTY_KEY);
    }
    /**
     * 获取玩家个人白名单
     */
    get(player) {
        try {
            return this.adapter.getForPlayer(player) ?? [];
        }
        catch (err) {
            Logger.error('读取个人白名单失败', err);
            return [];
        }
    }
    /**
     * 添加方块到个人白名单
     */
    add(player, blockId) {
        const list = this.get(player);
        if (list.includes(blockId))
            return false;
        list.push(blockId);
        this.set(player, list);
        return true;
    }
    /**
     * 从个人白名单移除方块
     */
    remove(player, blockId) {
        const list = this.get(player);
        const idx = list.indexOf(blockId);
        if (idx < 0)
            return false;
        list.splice(idx, 1);
        this.set(player, list);
        return true;
    }
    /**
     * 检查是否包含
     */
    has(player, blockId) {
        return this.get(player).includes(blockId);
    }
    /**
     * 清空个人白名单
     */
    clear(player) {
        this.set(player, []);
    }
    /**
     * 写入个人白名单
     */
    set(player, list) {
        const deduped = CollectionHelper.unique(list);
        this.adapter.setForPlayer(player, deduped);
    }
}
