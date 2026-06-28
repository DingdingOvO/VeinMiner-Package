/**
 * DataValidator.ts
 * 职责：数据校验与安全解析
 */
import { Logger } from '../../utils/Logger';
export class DataValidator {
    /**
     * 安全 JSON 解析
     */
    static parse(raw) {
        try {
            return JSON.parse(raw);
        }
        catch (err) {
            Logger.error('JSON 解析失败', err);
            return undefined;
        }
    }
    /**
     * 校验字符串数组
     */
    static validateStringArray(value) {
        if (!Array.isArray(value))
            return [];
        return value.filter((x) => typeof x === 'string');
    }
    /**
     * 校验数字
     */
    static validateNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
        const num = Number(value);
        if (!Number.isFinite(num))
            return min;
        return Math.max(min, Math.min(max, num));
    }
    /**
     * 校验布尔值
     */
    static validateBoolean(value) {
        return typeof value === 'boolean' ? value : false;
    }
}
