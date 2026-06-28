/**
 * OreWhitelist.ts
 * 职责：矿石类白名单（共享默认配置，所有环境通用）
 */

export const ORE_WHITELIST: readonly string[] = [
    'minecraft:coal_ore',
    'minecraft:deepslate_coal_ore',
    'minecraft:iron_ore',
    'minecraft:deepslate_iron_ore',
    'minecraft:copper_ore',
    'minecraft:deepslate_copper_ore',
    'minecraft:gold_ore',
    'minecraft:deepslate_gold_ore',
    'minecraft:redstone_ore',
    'minecraft:deepslate_redstone_ore',
    'minecraft:emerald_ore',
    'minecraft:deepslate_emerald_ore',
    'minecraft:lapis_ore',
    'minecraft:deepslate_lapis_ore',
    'minecraft:diamond_ore',
    'minecraft:deepslate_diamond_ore',
    'minecraft:nether_gold_ore',
    'minecraft:quartz_ore',
    'minecraft:ancient_debris'
];

export function getOreWhitelist(): string[] {
    return [...ORE_WHITELIST];
}
