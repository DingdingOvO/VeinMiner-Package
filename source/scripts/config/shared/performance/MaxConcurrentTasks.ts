/**
 * MaxConcurrentTasks.ts
 * 职责：全局最大并发连锁任务数
 */

export const MAX_CONCURRENT_TASKS = 8;

export function getMaxConcurrentTasks(): number {
    return MAX_CONCURRENT_TASKS;
}
