/**
 * TaskScheduler.ts
 * 职责：任务调度器，按 tick 调度连锁任务
 */

import { system } from '@minecraft/server';
import { Logger } from '../../utils/Logger';

export interface ScheduledTask {
    id: number;
    cancel: () => void;
}

export class TaskScheduler {
    private static nextId = 1;

    /**
     * 每 tick 执行
     */
    public static runInterval(callback: () => void, ticks: number = 1): ScheduledTask {
        const id = this.nextId++;
        const handle = system.runInterval(callback, ticks);
        return {
            id,
            cancel: () => {
                try {
                    system.clearRun(handle);
                } catch (err) {
                    Logger.error('取消任务失败', err);
                }
            }
        };
    }

    /**
     * 延迟执行
     */
    public static runTimeout(callback: () => void, ticks: number = 1): ScheduledTask {
        const id = this.nextId++;
        const handle = system.runTimeout(callback, ticks);
        return {
            id,
            cancel: () => {
                try {
                    system.clearRun(handle);
                } catch (err) {
                    Logger.error('取消任务失败', err);
                }
            }
        };
    }
}
