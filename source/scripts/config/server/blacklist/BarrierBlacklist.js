/**
 * BarrierBlacklist.ts
 * 职责：屏障黑名单
 */
export const BARRIER_BLACKLIST = ['minecraft:barrier', 'minecraft:light_block'];
export function getBarrierBlacklist() {
    return [...BARRIER_BLACKLIST];
}
