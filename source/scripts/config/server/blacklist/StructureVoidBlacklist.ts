/**
 * StructureVoidBlacklist.ts
 * 职责：结构空位黑名单
 */

export const STRUCTURE_VOID_BLACKLIST = ['minecraft:structure_void'] as const;

export function getStructureVoidBlacklist(): string[] {
    return [...STRUCTURE_VOID_BLACKLIST];
}
