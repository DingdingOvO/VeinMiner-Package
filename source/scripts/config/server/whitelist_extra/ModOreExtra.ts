/**
 * ModOreExtra.ts
 * 职责：模组矿石额外白名单模板（默认为空，服主可填入）
 */

export const MOD_ORE_EXTRA: readonly string[] = [];

export function getModOreExtra(): string[] {
    return [...MOD_ORE_EXTRA];
}
