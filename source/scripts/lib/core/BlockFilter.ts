/**
 * BlockFilter.ts
 * 职责：方块过滤逻辑，决定某个方块是否可以参与连锁
 * 综合考虑：白名单、黑名单、维度限制、特殊规则
 */

import { Block, Player } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

/** 过滤结果 */
export interface FilterResult {
    /** 是否允许 */
    allowed: boolean;
    /** 拒绝原因（如有） */
    reason?: string;
}

/**
 * 方块过滤器（无状态纯函数）
 */
export class BlockFilter {
    /**
     * 检查方块是否允许连锁
     * @param block 目标方块
     * @param player 触发玩家
     * @param registry 配置注册中心
     */
    public static check(block: Block, player: Player, registry: ConfigRegistry): FilterResult {
        try {
            // 1. 检查全局黑名单（仅服务端模式有效）
            if (registry.isBlacklisted(block.typeId)) {
                return { allowed: false, reason: 'blacklisted' };
            }

            // 2. 检查白名单（共享默认 + 环境/个人扩展）
            const whitelist = registry.getEffectiveWhitelist(player);
            if (!whitelist.includes(block.typeId)) {
                return { allowed: false, reason: 'not_in_whitelist' };
            }

            // 3. 检查维度限制
            const dimConfig = registry.getDimensionConfig(block.dimension.id);
            if (!dimConfig.enabled) {
                return { allowed: false, reason: 'dimension_disabled' };
            }

            // 4. 检查方块是否已加载
            if (block.isValid === false) {
                return { allowed: false, reason: 'unloaded' };
            }

            return { allowed: true };
        } catch (err) {
            Logger.error('BlockFilter.check 失败', err);
            return { allowed: false, reason: 'error' };
        }
    }

    /**
     * 检查方块是否在白名单中（便捷方法）
     */
    public static isInWhitelist(blockId: string, whitelist: string[]): boolean {
        return whitelist.includes(blockId);
    }

    /**
     * 检查方块是否在黑名单中
     */
    public static isBlacklisted(blockId: string, blacklist: string[]): boolean {
        return blacklist.includes(blockId);
    }
}
