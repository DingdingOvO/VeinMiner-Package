/**
 * MushroomRule.ts
 * 职责：蘑菇连锁规则
 */
export const MUSHROOM_RULE = {
    enabled: true,
    /** 单次最大蘑菇数量 */
    maxBlocks: 16
};
export function getMushroomRule() {
    return MUSHROOM_RULE;
}
/** 蘑菇方块ID列表 */
export const MUSHROOM_BLOCK_IDS = [
    'minecraft:red_mushroom',
    'minecraft:brown_mushroom',
    'minecraft:red_mushroom_block',
    'minecraft:brown_mushroom_block',
    'minecraft:mushroom_stem'
];
