/**
 * DurabilityHandler.ts
 * 职责：耐久消耗处理（封装 DurabilityManager）
 */

import { Player } from '@minecraft/server';
import { DurabilityManager } from '../../lib/core/DurabilityManager';

export class DurabilityHandler {
    public consume(player: Player, count: number): boolean {
        const result = DurabilityManager.consume(player, count);
        return result.success && !result.broken;
    }

    public hasEnough(player: Player, required: number): boolean {
        return DurabilityManager.hasEnough(player, required);
    }
}
