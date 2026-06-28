/**
 * CoordinateHelper.ts
 * 【修复】key() 使用 Math.floor 避免浮点坐标问题
 */

import { Vector3 } from '@minecraft/server';

export class CoordinateHelper {
    public static key(loc: Vector3): string {
        return `${Math.floor(loc.x)}|${Math.floor(loc.y)}|${Math.floor(loc.z)}`;
    }

    public static offset(loc: Vector3, delta: Vector3): Vector3 {
        return { x: loc.x + delta.x, y: loc.y + delta.y, z: loc.z + delta.z };
    }

    public static equals(a: Vector3, b: Vector3, epsilon = 0.001): boolean {
        return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon && Math.abs(a.z - b.z) < epsilon;
    }

    public static distance(a: Vector3, b: Vector3): number {
        const dx = a.x - b.x; const dy = a.y - b.y; const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    public static floor(loc: Vector3): Vector3 {
        return { x: Math.floor(loc.x), y: Math.floor(loc.y), z: Math.floor(loc.z) };
    }
}
