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
];
export function getButtonOrder() {
    return BUTTON_ORDER;
}
