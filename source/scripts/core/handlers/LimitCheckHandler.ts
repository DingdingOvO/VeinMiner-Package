/**
 * LimitCheckHandler.ts
 * 职责：检查连锁上限
 */

import { Block, Player } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';

export class LimitCheckHandler {
    private counts = new Map<string, number>();

    public check(block: Block, player: Player, registry: ConfigRegistry): boolean {
        const key = `${player.id}:${block.typeId}`;
        const current = this.counts.get(key) ?? 0;
        const limit = registry.getEffectiveMaxVein(player, block.typeId, block.dimension.id);
        if (current >= limit) {
            return false;
        }
        this.counts.set(key, current + 1);
        return true;
    }

    /**
     * 重置玩家的计数
     */
    public reset(player: Player): void {
        const prefix = `${player.id}:`;
        for (const key of this.counts.keys()) {
            if (key.startsWith(prefix)) {
                this.counts.delete(key);
            }
        }
    }
}
