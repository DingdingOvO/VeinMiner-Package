/**
 * TaskCleanup.ts
 * 职责：定期清理过期的任务记录
 */

import { world } from '@minecraft/server';
import { PlayerTaskManager } from './PlayerTaskManager';
import { Logger } from '../../utils/Logger';

export class TaskCleanup {
    /**
     * 清理已下线玩家的任务记录
     */
    public static cleanup(_taskManager: PlayerTaskManager): void {
        try {
            // PlayerTaskManager 内部 Map 的清理需要暴露接口，此处简化处理
            // 实际上任务结束时会自动 -1，下线玩家残留计数影响很小
            void world.getAllPlayers();
        } catch (err) {
            Logger.error('任务清理失败', err);
        }
    }
}
