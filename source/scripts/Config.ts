/**
 * Config.ts — VeinMiner 配置
 *
 * 白名单、黑名单、默认值、玩家偏好（DynamicProperty）
 */

import { Player } from '@minecraft/server';

// ═══════════════════════════════════════
//  方块白名单
// ═══════════════════════════════════════

const ORE_IDS: readonly string[] = [
    'minecraft:coal_ore', 'minecraft:deepslate_coal_ore',
    'minecraft:iron_ore', 'minecraft:deepslate_iron_ore',
    'minecraft:copper_ore', 'minecraft:deepslate_copper_ore',
    'minecraft:gold_ore', 'minecraft:deepslate_gold_ore',
    'minecraft:redstone_ore', 'minecraft:deepslate_redstone_ore',
    'minecraft:emerald_ore', 'minecraft:deepslate_emerald_ore',
    'minecraft:lapis_ore', 'minecraft:deepslate_lapis_ore',
    'minecraft:diamond_ore', 'minecraft:deepslate_diamond_ore',
    'minecraft:nether_gold_ore', 'minecraft:quartz_ore',
    'minecraft:ancient_debris',
];

const LOG_IDS: readonly string[] = [
    'minecraft:oak_log', 'minecraft:spruce_log', 'minecraft:birch_log',
    'minecraft:jungle_log', 'minecraft:acacia_log', 'minecraft:dark_oak_log',
    'minecraft:mangrove_log', 'minecraft:cherry_log',
    'minecraft:crimson_stem', 'minecraft:warped_stem',
];

const STONE_IDS: readonly string[] = [
    'minecraft:stone', 'minecraft:deepslate',
    'minecraft:granite', 'minecraft:diorite', 'minecraft:andesite',
    'minecraft:tuff', 'minecraft:calcite',
];

const LEAF_IDS: readonly string[] = [
    'minecraft:oak_leaves', 'minecraft:spruce_leaves', 'minecraft:birch_leaves',
    'minecraft:jungle_leaves', 'minecraft:acacia_leaves', 'minecraft:dark_oak_leaves',
    'minecraft:mangrove_leaves', 'minecraft:cherry_leaves',
    'minecraft:azalea_leaves', 'minecraft:azalea_leaves_flowered',
];

const BLACKLIST_IDS: readonly string[] = [
    'minecraft:bedrock', 'minecraft:barrier',
    'minecraft:command_block', 'minecraft:repeating_command_block', 'minecraft:chain_command_block',
    'minecraft:structure_void', 'minecraft:end_portal_frame',
    'minecraft:reinforced_deepslate', 'minecraft:light_block',
];

// 预构建 Set，O(1) 查询
const WHITELIST_SET = new Set<string>([...ORE_IDS, ...LOG_IDS, ...STONE_IDS]);
const LOG_SET = new Set<string>(LOG_IDS);
const LEAF_SET = new Set<string>(LEAF_IDS);
const BLACKLIST_SET = new Set<string>(BLACKLIST_IDS);

export function isWhitelisted(blockId: string): boolean {
    return WHITELIST_SET.has(blockId);
}

export function isBlacklisted(blockId: string): boolean {
    return BLACKLIST_SET.has(blockId);
}

export function isLogType(blockId: string): boolean {
    return LOG_SET.has(blockId);
}

export function getLeafIdSet(): ReadonlySet<string> {
    return LEAF_SET;
}

// ═══════════════════════════════════════
//  默认常量
// ═══════════════════════════════════════

export const DEFAULT_MAX_VEIN = 64;
export const SLIDER_MIN = 1;
export const SLIDER_MAX = 256;
export const SCAN_TIMEOUT_MS = 50;
export const LEAF_SCAN_RADIUS = 4;
export const LEAF_MAX_COUNT = 64;

// ═══════════════════════════════════════
//  玩家偏好（DynamicProperty）
// ═══════════════════════════════════════

const KEY_TOGGLE = 'vm:toggle';
const KEY_MAX_VEIN = 'vm:max_vein';
const KEY_COLLECT_DROPS = 'vm:collect_drops';

/** 连锁开关，默认开启 */
export function getPlayerToggle(p: Player): boolean {
    const v = p.getDynamicProperty(KEY_TOGGLE);
    return v !== false;
}

export function setPlayerToggle(p: Player, v: boolean): void {
    p.setDynamicProperty(KEY_TOGGLE, v);
}

/** 最大连锁数 */
export function getPlayerMaxVein(p: Player): number {
    const v = p.getDynamicProperty(KEY_MAX_VEIN);
    return typeof v === 'number' ? v : DEFAULT_MAX_VEIN;
}

export function setPlayerMaxVein(p: Player, v: number): void {
    p.setDynamicProperty(KEY_MAX_VEIN, v);
}

/** 掉落物集中，默认开启 */
export function getPlayerCollectDrops(p: Player): boolean {
    const v = p.getDynamicProperty(KEY_COLLECT_DROPS);
    return v !== false;
}

export function setPlayerCollectDrops(p: Player, v: boolean): void {
    p.setDynamicProperty(KEY_COLLECT_DROPS, v);
}