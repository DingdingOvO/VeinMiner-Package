/**
 * VinesRule.ts
 * 职责：藤蔓连锁规则
 */

export const VINES_RULE = {
    enabled: true,
    /** 单次最大藤蔓数量 */
    maxBlocks: 64
} as const;

export function getVinesRule(): typeof VINES_RULE {
    return VINES_RULE;
}
