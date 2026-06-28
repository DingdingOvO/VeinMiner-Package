/**
 * ExtraWhitelist.ts
 * 职责：额外白名单（如玻璃、冰、荧光浆果等）
 */
export const EXTRA_WHITELIST = [
    'minecraft:glass',
    'minecraft:glass_pane',
    'minecraft:ice',
    'minecraft:packed_ice',
    'minecraft:blue_ice',
    'minecraft:glowstone',
    'minecraft:sea_lantern',
    'minecraft:shroomlight',
    'minecraft:glow_berries',
    'minecraft:cactus',
    'minecraft:bamboo',
    'minecraft:sugar_cane',
    'minecraft:kelp',
    'minecraft:kelp_plant'
];
export function getExtraWhitelist() {
    return [...EXTRA_WHITELIST];
}
