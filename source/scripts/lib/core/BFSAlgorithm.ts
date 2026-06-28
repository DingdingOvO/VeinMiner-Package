/**
 * BFSAlgorithm.ts
 * 【修复】接收 Dimension + Vector3 + targetTypeId，不再依赖 Block 对象
 */

import { Dimension, Vector3 } from '@minecraft/server';

export interface BfsResult {
    blocks: { x: number; y: number; z: number }[];
    truncated: boolean;
    timedOut: boolean;
    elapsedMs: number;
}

export interface BfsOptions {
    maxBlocks: number;
    timeoutMs: number;
    targetTypeId: string;
    directions?: Vector3[];
}

const DEFAULT_DIRECTIONS: Vector3[] = [
    { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
];

function coordKey(x: number, y: number, z: number): string {
    return `${x}|${y}|${z}`;
}

export function bfsScan(dimension: Dimension, startLocation: Vector3, options: BfsOptions): BfsResult {
    const startTime = Date.now();
    const directions = options.directions ?? DEFAULT_DIRECTIONS;
    const targetTypeId = options.targetTypeId;

    const sx = Math.floor(startLocation.x);
    const sy = Math.floor(startLocation.y);
    const sz = Math.floor(startLocation.z);

    const result: { x: number; y: number; z: number }[] = [{ x: sx, y: sy, z: sz }];
    const visited = new Set<string>();
    visited.add(coordKey(sx, sy, sz));
    const queue: { x: number; y: number; z: number }[] = [{ x: sx, y: sy, z: sz }];
    let truncated = false;
    let timedOut = false;

    while (queue.length > 0) {
        if (Date.now() - startTime > options.timeoutMs) { timedOut = true; break; }
        if (result.length >= options.maxBlocks) { truncated = true; break; }

        const current = queue.shift()!;
        for (const dir of directions) {
            const nx = current.x + Math.floor(dir.x);
            const ny = current.y + Math.floor(dir.y);
            const nz = current.z + Math.floor(dir.z);
            const key = coordKey(nx, ny, nz);
            if (visited.has(key)) continue;
            visited.add(key);

            let nextBlock;
            try { nextBlock = dimension.getBlock({ x: nx, y: ny, z: nz }); } catch { continue; }
            if (!nextBlock) continue;

            if (nextBlock.typeId !== targetTypeId) continue;

            result.push({ x: nx, y: ny, z: nz });
            queue.push({ x: nx, y: ny, z: nz });
            if (result.length >= options.maxBlocks) { truncated = true; break; }
        }
        if (truncated) break;
    }

    return { blocks: result, truncated, timedOut, elapsedMs: Date.now() - startTime };
}

export function manhattanDistance(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}

export function sortByDistance(blocks: { x: number; y: number; z: number }[], origin: Vector3): { x: number; y: number; z: number }[] {
    return [...blocks].sort((a, b) => manhattanDistance(a, origin) - manhattanDistance(b, origin));
}
