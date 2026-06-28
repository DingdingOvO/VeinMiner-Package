/**
 * BarrierBlacklist.ts
 * 职责：屏障黑名单
 */

export const BARRIER_BLACKLIST = ['minecraft:barrier', 'minecraft:light_block'] as const;

export function getBarrierBlacklist(): string[] {
    return [...BARRIER_BLACKLIST];
}
