/**
 * PlayerTaskManager.ts
 * 职责：跟踪每个玩家的活跃任务数，防止并发过多
 */

import { Player } from '@minecraft/server';
import { PER_PLAYER_LIMIT_DEFAULT } from '../../config/server/globallimits/PerPlayerLimit';

export class PlayerTaskManager {
    private counts = new Map<string, number>();
    private maxPerPlayer = PER_PLAYER_LIMIT_DEFAULT;

    /**
     * 玩家是否可开启新任务
     */
    public canStart(player: Player): boolean {
        const count = this.counts.get(player.id) ?? 0;
        return count < this.maxPerPlayer;
    }

    /**
     * 任务开始
     */
    public start(player: Player): void {
        const cur = this.counts.get(player.id) ?? 0;
        this.counts.set(player.id, cur + 1);
    }

    /**
     * 任务结束
     */
    public finish(player: Player): void {
        const cur = this.counts.get(player.id) ?? 0;
        this.counts.set(player.id, Math.max(0, cur - 1));
    }

    /**
     * 获取玩家活跃任务数
     */
    public getActiveCount(player: Player): number {
        return this.counts.get(player.id) ?? 0;
    }
}
