/**
 * specialrules/index.ts
 * 职责：特殊规则统一导出
 */

export * from './LeafRule';
export * from './CropRule';
export * from './ObsidianRule';
export * from './VinesRule';
export * from './MushroomRule';

import { LEAF_RULE } from './LeafRule';
import { CROP_RULE } from './CropRule';
import { OBSIDIAN_RULE } from './ObsidianRule';
import { VINES_RULE } from './VinesRule';
import { MUSHROOM_RULE } from './MushroomRule';

/** 特殊规则聚合 */
export const SPECIAL_RULES = {
    leaf: LEAF_RULE,
    crop: CROP_RULE,
    obsidian: OBSIDIAN_RULE,
    vines: VINES_RULE,
    mushroom: MUSHROOM_RULE
} as const;
