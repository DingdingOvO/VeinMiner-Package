/**
 * ToolCheckHandler.ts
 * 职责：检查玩家手中工具是否合适
 */
import { ToolClassifier, ToolType } from '../../lib/core/ToolClassifier';
export class ToolCheckHandler {
    check(player) {
        const tool = ToolClassifier.classify(player);
        return tool.isValid && tool.type !== ToolType.NONE;
    }
}
