/**
 * LogWhitelist.ts
 * 职责：原木类白名单
 */

export const LOG_WHITELIST: readonly string[] = [
    'minecraft:oak_log',
    'minecraft:spruce_log',
    'minecraft:birch_log',
    'minecraft:jungle_log',
    'minecraft:acacia_log',
    'minecraft:dark_oak_log',
    'minecraft:mangrove_log',
    'minecraft:cherry_log',
    'minecraft:crimson_stem',
    'minecraft:warped_stem'
];

export function getLogWhitelist(): string[] {
    return [...LOG_WHITELIST];
}
