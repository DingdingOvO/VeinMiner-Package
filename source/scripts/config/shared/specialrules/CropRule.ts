/**
 * CropRule.ts
 * 职责：作物连锁规则
 */

export const CROP_RULE = {
    enabled: true,
    /** 仅成熟作物 */
    onlyMature: true,
    /** 单次最大作物数量 */
    maxBlocks: 32
} as const;

export function getCropRule(): typeof CROP_RULE {
    return CROP_RULE;
}

/** 作物方块ID列表 */
export const CROP_BLOCK_IDS: readonly string[] = [
    'minecraft:wheat',
    'minecraft:carrots',
    'minecraft:potatoes',
    'minecraft:beetroots',
    'minecraft:nether_wart'
];
