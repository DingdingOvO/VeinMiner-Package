/**
 * ToolClassifier.ts
 * 职责：识别与分类玩家手中的工具
 * 基于工具 typeId 关键词匹配，决定是否允许触发对应类型的连锁
 */

import { ItemStack, Player } from '@minecraft/server';
import { ToolMappingConfig } from '../../config/shared/toolmapping';

/** 工具类型枚举 */
export enum ToolType {
    PICKAXE = 'pickaxe',
    AXE = 'axe',
    SHOVEL = 'shovel',
    SHEARS = 'shears',
    SWORD = 'sword',
    HOE = 'hoe',
    NONE = 'none'
}

/** 工具识别结果 */
export interface ToolInfo {
    type: ToolType;
    /** 工具 itemId（如 minecraft:diamond_pickaxe） */
    itemId: string;
    /** 是否为有效工具（任一类型） */
    isValid: boolean;
    /** 工具材质（如 diamond/iron/stone/wood/golden/netherite） */
    tier?: string;
}

/**
 * 工具分类器
 */
export class ToolClassifier {
    /**
     * 识别玩家主手中的工具
     * @param player 玩家
     * @returns 工具信息（无工具返回 NONE）
     */
    public static classify(player: Player): ToolInfo {
        try {
            const equippable = player.getComponent('minecraft:equippable');
            if (!equippable) {
                return { type: ToolType.NONE, itemId: '', isValid: false };
            }
            const mainHand = equippable.getEquipmentSlot('Mainhand' as never) as unknown as { getItem?: () => ItemStack | undefined };
            const item = mainHand?.getItem?.();
            if (!item) {
                return { type: ToolType.NONE, itemId: '', isValid: false };
            }
            return this.classifyItem(item);
        } catch (err) {
            return { type: ToolType.NONE, itemId: '', isValid: false };
        }
    }

    /**
     * 识别 ItemStack 的工具类型
     */
    public static classifyItem(item: ItemStack): ToolInfo {
        const id = item.typeId.toLowerCase();
        const tier = this.extractTier(id);

        for (const [type, keywords] of Object.entries(ToolMappingConfig) as [string, readonly string[]][]) {
            for (const kw of keywords) {
                if (id.includes(kw)) {
                    return {
                        type: type as ToolType,
                        itemId: item.typeId,
                        isValid: true,
                        tier
                    };
                }
            }
        }
        return { type: ToolType.NONE, itemId: item.typeId, isValid: false };
    }

    /**
     * 提取工具材质等级
     */
    private static extractTier(itemId: string): string | undefined {
        const tiers = ['netherite', 'diamond', 'iron', 'golden', 'stone', 'wooden'];
        for (const t of tiers) {
            if (itemId.includes(t)) return t;
        }
        return undefined;
    }

    /**
     * 工具是否适用于给定方块（粗略判断，实际由白名单决定）
     */
    public static isApplicable(tool: ToolType, blockId: string): boolean {
        const id = blockId.toLowerCase();
        if (tool === ToolType.PICKAXE && (id.includes('ore') || id.includes('stone') || id.includes('deepslate'))) {
            return true;
        }
        if (tool === ToolType.AXE && (id.includes('log') || id.includes('planks'))) {
            return true;
        }
        if (tool === ToolType.SHOVEL && (id.includes('dirt') || id.includes('sand') || id.includes('gravel'))) {
            return true;
        }
        return false;
    }
}
