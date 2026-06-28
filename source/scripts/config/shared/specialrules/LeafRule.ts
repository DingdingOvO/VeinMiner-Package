/**
 * LeafRule.ts
 * 职责：树叶连锁规则
 * 用斧头砍树时，可一并清除附近树叶
 */

export const LEAF_RULE = {
    enabled: true,
    /** 树叶最大连锁半径（曼哈顿距离） */
    maxRadius: 4,
    /** 单次最大树叶数量 */
    maxBlocks: 32,
    /** 是否需要剪秋铗 */
    requiresShears: false
} as const;

export function getLeafRule(): typeof LEAF_RULE {
    return LEAF_RULE;
}
