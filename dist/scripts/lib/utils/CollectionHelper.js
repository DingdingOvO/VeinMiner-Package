/**
 * CollectionHelper.ts
 * 职责：集合操作的辅助函数
 */
export class CollectionHelper {
    /** 数组去重 */
    static unique(arr) {
        return [...new Set(arr)];
    }
    /** 数组差集（a - b） */
    static difference(a, b) {
        const setB = new Set(b);
        return a.filter(x => !setB.has(x));
    }
    /** 数组交集 */
    static intersect(a, b) {
        const setB = new Set(b);
        return a.filter(x => setB.has(x));
    }
    /** 数组并集 */
    static union(a, b) {
        return [...new Set([...a, ...b])];
    }
    /** 数组分块（用于分批处理） */
    static chunk(arr, size) {
        if (size <= 0)
            throw new Error('chunk size must be positive');
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }
    /** 安全访问数组元素 */
    static safeGet(arr, index) {
        return index >= 0 && index < arr.length ? arr[index] : undefined;
    }
}
