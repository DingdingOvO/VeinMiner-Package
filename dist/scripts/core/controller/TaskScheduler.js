/**
 * TaskScheduler.ts
 * 职责：任务调度器，按 tick 调度连锁任务
 */
import { system } from '@minecraft/server';
import { Logger } from '../../utils/Logger';
export class TaskScheduler {
    static nextId = 1;
    /**
     * 每 tick 执行
     */
    static runInterval(callback, ticks = 1) {
        const id = this.nextId++;
        const handle = system.runInterval(callback, ticks);
        return {
            id,
            cancel: () => {
                try {
                    system.clearRun(handle);
                }
                catch (err) {
                    Logger.error('取消任务失败', err);
                }
            }
        };
    }
    /**
     * 延迟执行
     */
    static runTimeout(callback, ticks = 1) {
        const id = this.nextId++;
        const handle = system.runTimeout(callback, ticks);
        return {
            id,
            cancel: () => {
                try {
                    system.clearRun(handle);
                }
                catch (err) {
                    Logger.error('取消任务失败', err);
                }
            }
        };
    }
}
