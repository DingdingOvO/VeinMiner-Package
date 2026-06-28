/**
 * PerPlayerLimit.ts
 * 职责：单玩家最大并发任务数
 */

export const PER_PLAYER_LIMIT_DEFAULT = 2;

export function getPerPlayerLimitDefault(): number {
    return PER_PLAYER_LIMIT_DEFAULT;
}
