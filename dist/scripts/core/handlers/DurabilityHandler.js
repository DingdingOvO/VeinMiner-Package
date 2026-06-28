/**
 * DurabilityHandler.ts
 * 职责：耐久消耗处理（封装 DurabilityManager）
 */
import { DurabilityManager } from '../../lib/core/DurabilityManager';
export class DurabilityHandler {
    consume(player, count) {
        const result = DurabilityManager.consume(player, count);
        return result.success && !result.broken;
    }
    hasEnough(player, required) {
        return DurabilityManager.hasEnough(player, required);
    }
}
