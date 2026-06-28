/**
 * MaxConcurrentTasks.ts
 * 职责：服务端最大并发任务数
 */

export const MAX_CONCURRENT_TASKS_DEFAULT = 8;

export function getMaxConcurrentTasksDefault(): number {
    return MAX_CONCURRENT_TASKS_DEFAULT;
}
