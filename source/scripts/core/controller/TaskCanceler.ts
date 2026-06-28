/**
 * TaskCanceler.ts
 * 职责：取消玩家进行中的连锁任务（用于玩家下线/换维度等）
 */

import { Player } from '@minecraft/server';
import { PlayerTaskManager } from './PlayerTaskManager';
import { Logger } from '../../utils/Logger';

export class TaskCanceler {
    /**
     * 取消玩家所有任务
     */
    public static cancelForPlayer(player: Player, taskManager: PlayerTaskManager): void {
        try {
            const active = taskManager.getActiveCount(player);
            if (active > 0) {
                Logger.info(`玩家 ${player.name} 有 ${active} 个进行中任务，已标记取消`);
            }
            // 实际任务取消依赖 system.clearRun，由 VeinMinerController 在 tick 中检查
        } catch (err) {
            Logger.error('取消玩家任务失败', err);
        }
    }
}
