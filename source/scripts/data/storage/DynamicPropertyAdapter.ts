/**
 * DynamicPropertyAdapter.ts
 * 职责：DynamicProperty 通用适配器，封装类型化读写
 * 支持玩家级与世界级存储
 */

import { Player, world } from '@minecraft/server';
import { Logger } from '../../utils/Logger';
import { DataValidator } from './DataValidator';

export class DynamicPropertyAdapter<T> {
    constructor(private readonly key: string) {}

    /**
     * 读取玩家级数据
     */
    public getForPlayer(player: Player): T | undefined {
        try {
            const raw = player.getDynamicProperty(this.key);
            if (raw === undefined || raw === null) return undefined;
            if (typeof raw === 'string') {
                return DataValidator.parse<T>(raw);
            }
            return raw as unknown as T;
        } catch (err) {
            Logger.error(`DynamicProperty 读取失败 (player=${player.name}, key=${this.key})`, err);
            return undefined;
        }
    }

    /**
     * 写入玩家级数据
     */
    public setForPlayer(player: Player, value: T): void {
        try {
            const serialized = typeof value === 'object' ? JSON.stringify(value) : value;
            player.setDynamicProperty(this.key, serialized as never);
        } catch (err) {
            Logger.error(`DynamicProperty 写入失败 (player=${player.name}, key=${this.key})`, err);
        }
    }

    /**
     * 读取世界级数据
     */
    public getForWorld(): T | undefined {
        try {
            const raw = world.getDynamicProperty(this.key);
            if (raw === undefined || raw === null) return undefined;
            if (typeof raw === 'string') {
                return DataValidator.parse<T>(raw);
            }
            return raw as unknown as T;
        } catch (err) {
            Logger.error(`DynamicProperty 读取失败 (world, key=${this.key})`, err);
            return undefined;
        }
    }

    /**
     * 写入世界级数据
     */
    public setForWorld(value: T): void {
        try {
            const serialized = typeof value === 'object' ? JSON.stringify(value) : value;
            world.setDynamicProperty(this.key, serialized as never);
        } catch (err) {
            Logger.error(`DynamicProperty 写入失败 (world, key=${this.key})`, err);
        }
    }

    /**
     * 清除玩家级数据
     */
    public clearForPlayer(player: Player): void {
        try {
            player.setDynamicProperty(this.key, undefined);
        } catch (err) {
            Logger.error(`DynamicProperty 清除失败 (player=${player.name}, key=${this.key})`, err);
        }
    }
}
