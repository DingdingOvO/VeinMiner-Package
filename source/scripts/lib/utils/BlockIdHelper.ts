/**
 * BlockIdHelper.ts
 * 职责：方块ID 与坐标相关的辅助函数
 */

import { Block, Dimension, Vector3 } from '@minecraft/server';
import { Logger } from '../../utils/Logger';

export class BlockIdHelper {
    /**
     * 安全获取维度中指定坐标的方块
     * @returns 方块对象或 undefined（区块未加载/越界）
     */
    public static getBlockAt(dimension: Dimension, location: Vector3): Block | undefined {
        try {
            return dimension.getBlock(location);
        } catch (err) {
            Logger.debug(`getBlockAt 失败 (${location.x},${location.y},${location.z}): ${err}`);
            return undefined;
        }
    }

    /**
     * 提取方块的基础类型名（去掉 minecraft: 前缀）
     */
    public static shortName(typeId: string): string {
        return typeId.replace(/^minecraft:/, '');
    }

    /**
     * 比较两个方块ID是否同类型
     */
    public static sameType(a: string, b: string): boolean {
        return a === b;
    }

    /**
     * 标准化方块ID（确保有 minecraft: 前缀）
     */
    public static normalize(id: string): string {
        if (id.includes(':')) return id;
        return `minecraft:${id}`;
    }
}
