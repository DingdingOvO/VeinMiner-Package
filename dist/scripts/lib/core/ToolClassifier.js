/**
 * ToolClassifier.ts
 * 职责：识别与分类玩家手中的工具
 * 基于工具 typeId 关键词匹配，决定是否允许触发对应类型的连锁
 */
import { ToolMappingConfig } from '../../config/shared/toolmapping';
/** 工具类型枚举 */
export var ToolType;
(function (ToolType) {
    ToolType["PICKAXE"] = "pickaxe";
    ToolType["AXE"] = "axe";
    ToolType["SHOVEL"] = "shovel";
    ToolType["SHEARS"] = "shears";
    ToolType["SWORD"] = "sword";
    ToolType["HOE"] = "hoe";
    ToolType["NONE"] = "none";
})(ToolType || (ToolType = {}));
/**
 * 工具分类器
 */
export class ToolClassifier {
    /**
     * 识别玩家主手中的工具
     * @param player 玩家
     * @returns 工具信息（无工具返回 NONE）
     */
    static classify(player) {
        try {
            const equippable = player.getComponent('minecraft:equippable');
            if (!equippable) {
                return { type: ToolType.NONE, itemId: '', isValid: false };
            }
            const mainHand = equippable.getEquipmentSlot('Mainhand');
            const item = mainHand?.getItem?.();
            if (!item) {
                return { type: ToolType.NONE, itemId: '', isValid: false };
            }
            return this.classifyItem(item);
        }
        catch (err) {
            return { type: ToolType.NONE, itemId: '', isValid: false };
        }
    }
    /**
     * 识别 ItemStack 的工具类型
     */
    static classifyItem(item) {
        const id = item.typeId.toLowerCase();
        const tier = this.extractTier(id);
        for (const [type, keywords] of Object.entries(ToolMappingConfig)) {
            for (const kw of keywords) {
                if (id.includes(kw)) {
                    return {
                        type: type,
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
    static extractTier(itemId) {
        const tiers = ['netherite', 'diamond', 'iron', 'golden', 'stone', 'wooden'];
        for (const t of tiers) {
            if (itemId.includes(t))
                return t;
        }
        return undefined;
    }
    /**
     * 工具是否适用于给定方块（粗略判断，实际由白名单决定）
     */
    static isApplicable(tool, blockId) {
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
