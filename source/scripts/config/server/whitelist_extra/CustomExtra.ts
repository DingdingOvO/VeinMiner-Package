/**
 * CustomExtra.ts
 * 职责：自定义额外白名单模板
 */

export const CUSTOM_EXTRA: readonly string[] = [];

export function getCustomExtra(): string[] {
    return [...CUSTOM_EXTRA];
}
