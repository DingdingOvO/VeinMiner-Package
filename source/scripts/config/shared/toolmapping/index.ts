/**
 * toolmapping/index.ts
 * 职责：工具映射统一导出
 */

export * from './PickaxeMapping';
export * from './AxeMapping';
export * from './ShovelMapping';

import { PICKAXE_KEYWORDS } from './PickaxeMapping';
import { AXE_KEYWORDS } from './AxeMapping';
import { SHOVEL_KEYWORDS } from './ShovelMapping';

/** 工具类型 → 关键词列表 映射 */
export const ToolMappingConfig = {
    pickaxe: PICKAXE_KEYWORDS,
    axe: AXE_KEYWORDS,
    shovel: SHOVEL_KEYWORDS,
    shears: ['shears'],
    sword: ['sword'],
    hoe: ['hoe']
} as const;

export type ToolMappingKey = keyof typeof ToolMappingConfig;

/** 获取所有映射的 entries */
export function getToolMappingEntries(): Array<[string, readonly string[]]> {
    return Object.entries(ToolMappingConfig);
}
