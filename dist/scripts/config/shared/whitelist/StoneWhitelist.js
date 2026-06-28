/**
 * StoneWhitelist.ts
 * 职责：石材类白名单
 */
export const STONE_WHITELIST = [
    'minecraft:stone',
    'minecraft:cobblestone',
    'minecraft:deepslate',
    'minecraft:cobbled_deepslate',
    'minecraft:granite',
    'minecraft:diorite',
    'minecraft:andesite',
    'minecraft:tuff',
    'minecraft:basalt',
    'minecraft:blackstone',
    'minecraft:netherrack',
    'minecraft:end_stone',
    'minecraft:sandstone',
    'minecraft:red_sandstone'
];
export function getStoneWhitelist() {
    return [...STONE_WHITELIST];
}
