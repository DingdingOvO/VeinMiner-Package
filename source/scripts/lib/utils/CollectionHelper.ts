/**
 * CollectionHelper.ts
 * 职责：集合操作的辅助函数
 */

export class CollectionHelper {
    /** 数组去重 */
    public static unique<T>(arr: T[]): T[] {
        return [...new Set(arr)];
    }

    /** 数组差集（a - b） */
    public static difference<T>(a: T[], b: T[]): T[] {
        const setB = new Set(b);
        return a.filter(x => !setB.has(x));
    }

    /** 数组交集 */
    public static intersect<T>(a: T[], b: T[]): T[] {
        const setB = new Set(b);
        return a.filter(x => setB.has(x));
    }

    /** 数组并集 */
    public static union<T>(a: T[], b: T[]): T[] {
        return [...new Set([...a, ...b])];
    }

    /** 数组分块（用于分批处理） */
    public static chunk<T>(arr: T[], size: number): T[][] {
        if (size <= 0) throw new Error('chunk size must be positive');
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    /** 安全访问数组元素 */
    public static safeGet<T>(arr: T[], index: number): T | undefined {
        return index >= 0 && index < arr.length ? arr[index] : undefined;
    }
}
