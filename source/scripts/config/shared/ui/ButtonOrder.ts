/**
 * ButtonOrder.ts
 * 职责：UI 按钮顺序定义
 */

export const BUTTON_ORDER = [
    'toggle',
    'maxBlocks',
    'whitelist',
    'status',
    'reload',
    'reset'
] as const;

export type ButtonKey = typeof BUTTON_ORDER[number];

export function getButtonOrder(): readonly ButtonKey[] {
    return BUTTON_ORDER;
}
