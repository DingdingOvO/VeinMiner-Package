/**
 * blocklimits/index.ts
 * 职责：方块上限默认值统一导出
 */
export * from './StoneLimit';
export * from './DeepslateLimit';
export * from './DiamondOreLimit';
export * from './DeepslateDiamondOreLimit';
export * from './IronOreLimit';
export * from './GoldOreLimit';
export * from './CoalOreLimit';
export * from './CopperOreLimit';
export * from './RedstoneOreLimit';
export * from './EmeraldOreLimit';
export * from './OakLogLimit';
export * from './SpruceLogLimit';
export * from './BirchLogLimit';
export * from './JungleLogLimit';
export * from './AcaciaLogLimit';
export * from './DarkOakLogLimit';
export * from './MangroveLogLimit';
export * from './CherryLogLimit';
import { STONE_LIMIT } from './StoneLimit';
import { DEEPSLATE_LIMIT } from './DeepslateLimit';
import { DIAMOND_ORE_LIMIT } from './DiamondOreLimit';
import { DEEPSLATE_DIAMOND_ORE_LIMIT } from './DeepslateDiamondOreLimit';
import { IRON_ORE_LIMIT } from './IronOreLimit';
import { GOLD_ORE_LIMIT } from './GoldOreLimit';
import { COAL_ORE_LIMIT } from './CoalOreLimit';
import { COPPER_ORE_LIMIT } from './CopperOreLimit';
import { REDSTONE_ORE_LIMIT } from './RedstoneOreLimit';
import { EMERALD_ORE_LIMIT } from './EmeraldOreLimit';
import { OAK_LOG_LIMIT } from './OakLogLimit';
import { SPRUCE_LOG_LIMIT } from './SpruceLogLimit';
import { BIRCH_LOG_LIMIT } from './BirchLogLimit';
import { JUNGLE_LOG_LIMIT } from './JungleLogLimit';
import { ACACIA_LOG_LIMIT } from './AcaciaLogLimit';
import { DARK_OAK_LOG_LIMIT } from './DarkOakLogLimit';
import { MANGROVE_LOG_LIMIT } from './MangroveLogLimit';
import { CHERRY_LOG_LIMIT } from './CherryLogLimit';
/** 方块默认上限表（用于未在自定义配置中时的回退） */
export const DEFAULT_BLOCK_LIMITS = {
    'minecraft:stone': STONE_LIMIT,
    'minecraft:deepslate': DEEPSLATE_LIMIT,
    'minecraft:diamond_ore': DIAMOND_ORE_LIMIT,
    'minecraft:deepslate_diamond_ore': DEEPSLATE_DIAMOND_ORE_LIMIT,
    'minecraft:iron_ore': IRON_ORE_LIMIT,
    'minecraft:deepslate_iron_ore': IRON_ORE_LIMIT,
    'minecraft:gold_ore': GOLD_ORE_LIMIT,
    'minecraft:deepslate_gold_ore': GOLD_ORE_LIMIT,
    'minecraft:coal_ore': COAL_ORE_LIMIT,
    'minecraft:deepslate_coal_ore': COAL_ORE_LIMIT,
    'minecraft:copper_ore': COPPER_ORE_LIMIT,
    'minecraft:deepslate_copper_ore': COPPER_ORE_LIMIT,
    'minecraft:redstone_ore': REDSTONE_ORE_LIMIT,
    'minecraft:deepslate_redstone_ore': REDSTONE_ORE_LIMIT,
    'minecraft:emerald_ore': EMERALD_ORE_LIMIT,
    'minecraft:deepslate_emerald_ore': EMERALD_ORE_LIMIT,
    'minecraft:oak_log': OAK_LOG_LIMIT,
    'minecraft:spruce_log': SPRUCE_LOG_LIMIT,
    'minecraft:birch_log': BIRCH_LOG_LIMIT,
    'minecraft:jungle_log': JUNGLE_LOG_LIMIT,
    'minecraft:acacia_log': ACACIA_LOG_LIMIT,
    'minecraft:dark_oak_log': DARK_OAK_LOG_LIMIT,
    'minecraft:mangrove_log': MANGROVE_LOG_LIMIT,
    'minecraft:cherry_log': CHERRY_LOG_LIMIT
};
