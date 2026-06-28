/**
 * ShovelMapping.ts
 * 职责：锹类工具的关键词映射
 */

export const SHOVEL_KEYWORDS: readonly string[] = [
    'shovel',
    'spade'
];

export function getShovelKeywords(): string[] {
    return [...SHOVEL_KEYWORDS];
}
