/**
 * LimitCheckHandler.ts
 * 职责：检查连锁上限
 */
export class LimitCheckHandler {
    counts = new Map();
    check(block, player, registry) {
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
    reset(player) {
        const prefix = `${player.id}:`;
        for (const key of this.counts.keys()) {
            if (key.startsWith(prefix)) {
                this.counts.delete(key);
            }
        }
    }
}
