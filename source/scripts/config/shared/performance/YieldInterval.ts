/**
 * YieldInterval.ts
 * 职责：每次 yield 之间处理多少方块后让出执行权
 */

export const YIELD_INTERVAL = 8;

export function getYieldInterval(): number {
    return YIELD_INTERVAL;
}
