/**
 * CoordinateHelper.ts
 * 【修复】key() 使用 Math.floor 避免浮点坐标问题
 */
export class CoordinateHelper {
    static key(loc) {
        return `${Math.floor(loc.x)}|${Math.floor(loc.y)}|${Math.floor(loc.z)}`;
    }
    static offset(loc, delta) {
        return { x: loc.x + delta.x, y: loc.y + delta.y, z: loc.z + delta.z };
    }
    static equals(a, b, epsilon = 0.001) {
        return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon && Math.abs(a.z - b.z) < epsilon;
    }
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    static floor(loc) {
        return { x: Math.floor(loc.x), y: Math.floor(loc.y), z: Math.floor(loc.z) };
    }
}
