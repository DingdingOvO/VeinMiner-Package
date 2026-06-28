/**
 * DynamicPropertyAdapter.ts
 * 职责：DynamicProperty 通用适配器，封装类型化读写
 * 支持玩家级与世界级存储
 */
import { world } from '@minecraft/server';
import { Logger } from '../../utils/Logger';
import { DataValidator } from './DataValidator';
export class DynamicPropertyAdapter {
    key;
    constructor(key) {
        this.key = key;
    }
    /**
     * 读取玩家级数据
     */
    getForPlayer(player) {
        try {
            const raw = player.getDynamicProperty(this.key);
            if (raw === undefined || raw === null)
                return undefined;
            if (typeof raw === 'string') {
                return DataValidator.parse(raw);
            }
            return raw;
        }
        catch (err) {
            Logger.error(`DynamicProperty 读取失败 (player=${player.name}, key=${this.key})`, err);
            return undefined;
        }
    }
    /**
     * 写入玩家级数据
     */
    setForPlayer(player, value) {
        try {
            const serialized = typeof value === 'object' ? JSON.stringify(value) : value;
            player.setDynamicProperty(this.key, serialized);
        }
        catch (err) {
            Logger.error(`DynamicProperty 写入失败 (player=${player.name}, key=${this.key})`, err);
        }
    }
    /**
     * 读取世界级数据
     */
    getForWorld() {
        try {
            const raw = world.getDynamicProperty(this.key);
            if (raw === undefined || raw === null)
                return undefined;
            if (typeof raw === 'string') {
                return DataValidator.parse(raw);
            }
            return raw;
        }
        catch (err) {
            Logger.error(`DynamicProperty 读取失败 (world, key=${this.key})`, err);
            return undefined;
        }
    }
    /**
     * 写入世界级数据
     */
    setForWorld(value) {
        try {
            const serialized = typeof value === 'object' ? JSON.stringify(value) : value;
            world.setDynamicProperty(this.key, serialized);
        }
        catch (err) {
            Logger.error(`DynamicProperty 写入失败 (world, key=${this.key})`, err);
        }
    }
    /**
     * 清除玩家级数据
     */
    clearForPlayer(player) {
        try {
            player.setDynamicProperty(this.key, undefined);
        }
        catch (err) {
            Logger.error(`DynamicProperty 清除失败 (player=${player.name}, key=${this.key})`, err);
        }
    }
}
