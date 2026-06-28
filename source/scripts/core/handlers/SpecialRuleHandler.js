/**
 * SpecialRuleHandler.ts
 * 职责：检查特殊规则（如黑曜石需要钻石镐+、作物需要成熟等）
 */
import { ToolClassifier } from '../../lib/core/ToolClassifier';
import { SPECIAL_RULES } from '../../config/shared/specialrules';
import { Logger } from '../../utils/Logger';
export class SpecialRuleHandler {
    check(block, player) {
        try {
            const id = block.typeId;
            // 黑曜石特殊规则
            if (id === 'minecraft:obsidian' || id === 'minecraft:crying_obsidian') {
                if (!SPECIAL_RULES.obsidian.enabled)
                    return false;
                const tool = ToolClassifier.classify(player);
                if (SPECIAL_RULES.obsidian.requireMinTier === 'diamond' &&
                    tool.tier !== 'diamond' && tool.tier !== 'netherite') {
                    return false;
                }
            }
            // 其他特殊规则可在此扩展
            return true;
        }
        catch (err) {
            Logger.error('SpecialRuleHandler 检查失败', err);
            return true;
        }
    }
}
