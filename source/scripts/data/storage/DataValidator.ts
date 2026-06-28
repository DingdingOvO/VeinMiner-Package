/**
 * DataValidator.ts
 * 职责：数据校验与安全解析
 */

import { Logger } from '../../utils/Logger';

export class DataValidator {
    /**
     * 安全 JSON 解析
     */
    public static parse<T>(raw: string): T | undefined {
        try {
            return JSON.parse(raw) as T;
        } catch (err) {
            Logger.error('JSON 解析失败', err);
            return undefined;
        }
    }

    /**
     * 校验字符串数组
     */
    public static validateStringArray(value: unknown): string[] {
        if (!Array.isArray(value)) return [];
        return value.filter((x): x is string => typeof x === 'string');
    }

    /**
     * 校验数字
     */
    public static validateNumber(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
        const num = Number(value);
        if (!Number.isFinite(num)) return min;
        return Math.max(min, Math.min(max, num));
    }

    /**
     * 校验布尔值
     */
    public static validateBoolean(value: unknown): boolean {
        return typeof value === 'boolean' ? value : false;
    }
}
