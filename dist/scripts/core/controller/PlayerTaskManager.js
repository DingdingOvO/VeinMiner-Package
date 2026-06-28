/**
 * PlayerTaskManager.ts
 * 职责：跟踪每个玩家的活跃任务数，防止并发过多
 */
import { PER_PLAYER_LIMIT_DEFAULT } from '../../config/server/globallimits/PerPlayerLimit';
export class PlayerTaskManager {
    counts = new Map();
    maxPerPlayer = PER_PLAYER_LIMIT_DEFAULT;
    /**
     * 玩家是否可开启新任务
     */
    canStart(player) {
        const count = this.counts.get(player.id) ?? 0;
        return count < this.maxPerPlayer;
    }
    /**
     * 任务开始
     */
    start(player) {
        const cur = this.counts.get(player.id) ?? 0;
        this.counts.set(player.id, cur + 1);
    }
    /**
     * 任务结束
     */
    finish(player) {
        const cur = this.counts.get(player.id) ?? 0;
        this.counts.set(player.id, Math.max(0, cur - 1));
    }
    /**
     * 获取玩家活跃任务数
     */
    getActiveCount(player) {
        return this.counts.get(player.id) ?? 0;
    }
}
