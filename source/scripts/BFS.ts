/**
 * BFS.ts — 连锁扫描算法
 *
 * 6 面方向（矿石/石头） / 26 面方向（原木，覆盖斜向生长）
 * 附带树叶扫描与距离排序
 */

import { Dimension, Vector3 } from '@minecraft/server';

// ═══════════════════════════════════════
//  方向向量
// ═══════════════════════════════════════

const DIR_6: Vector3[] = [
    { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 },
];

const DIR_26: Vector3[] = [];
for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++)
            if (dx || dy || dz) DIR_26.push({ x: dx, y: dy, z: dz });

// ═══════════════════════════════════════
//  类型
// ═══════════════════════════════════════

export interface Pos {
    x: number;
    y: number;
    z: number;
}

export interface BfsResult {
    blocks: Pos[];
    timedOut: boolean;
}

// ═══════════════════════════════════════
//  BFS 扫描
// ═══════════════════════════════════════

function key(x: number, y: number, z: number): string {
    return `${x},${y},${z}`;
}

export function bfsScan(
    dim: Dimension,
    start: Vector3,
    targetTypeId: string,
    maxBlocks: number,
    timeoutMs: number,
    use26: boolean,
): BfsResult {
    const dirs = use26 ? DIR_26 : DIR_6;
    const sx = Math.floor(start.x);
    const sy = Math.floor(start.y);
    const sz = Math.floor(start.z);

    const result: Pos[] = [{ x: sx, y: sy, z: sz }];
    const visited = new Set<string>([key(sx, sy, sz)]);
    const queue: Pos[] = [{ x: sx, y: sy, z: sz }];
    const t0 = Date.now();

    while (queue.length > 0) {
        if (Date.now() - t0 > timeoutMs) return { blocks: result, timedOut: true };
        if (result.length >= maxBlocks) return { blocks: result, timedOut: false };

        const cur = queue.shift()!;
        for (const d of dirs) {
            const nx = cur.x + d.x;
            const ny = cur.y + d.y;
            const nz = cur.z + d.z;
            const k = key(nx, ny, nz);
            if (visited.has(k)) continue;
            visited.add(k);

            let block;
            try { block = dim.getBlock({ x: nx, y: ny, z: nz }); } catch { continue; }
            if (!block || block.typeId !== targetTypeId) continue;

            result.push({ x: nx, y: ny, z: nz });
            queue.push({ x: nx, y: ny, z: nz });
            if (result.length >= maxBlocks) return { blocks: result, timedOut: false };
        }
    }

    return { blocks: result, timedOut: false };
}

// ═══════════════════════════════════════
//  树叶扫描
// ═══════════════════════════════════════

export function scanLeaves(
    dim: Dimension,
    logPositions: Pos[],
    leafTypeIds: ReadonlySet<string>,
    maxRadius: number,
    maxCount: number,
): Pos[] {
    const leaves: Pos[] = [];
    const visited = new Set<string>();

    for (const log of logPositions) {
        if (leaves.length >= maxCount) break;
        for (let dx = -maxRadius; dx <= maxRadius; dx++) {
            if (leaves.length >= maxCount) break;
            for (let dy = -maxRadius; dy <= maxRadius; dy++) {
                if (leaves.length >= maxCount) break;
                for (let dz = -maxRadius; dz <= maxRadius; dz++) {
                    if (leaves.length >= maxCount) break;
                    const dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
                    if (dist > maxRadius || dist === 0) continue;
                    const nx = log.x + dx;
                    const ny = log.y + dy;
                    const nz = log.z + dz;
                    const k = key(nx, ny, nz);
                    if (visited.has(k)) continue;
                    visited.add(k);
                    try {
                        const b = dim.getBlock({ x: nx, y: ny, z: nz });
                        if (b && leafTypeIds.has(b.typeId)) {
                            leaves.push({ x: nx, y: ny, z: nz });
                        }
                    } catch { /* ignore */ }
                }
            }
        }
    }
    return leaves;
}

// ═══════════════════════════════════════
//  距离排序
// ═══════════════════════════════════════

function manhattan(a: Pos, b: Vector3): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

export function sortByDistance(blocks: Pos[], origin: Vector3): Pos[] {
    return [...blocks].sort((a, b) => manhattan(a, origin) - manhattan(b, origin));
}