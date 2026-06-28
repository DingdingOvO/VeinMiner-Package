/**
 * BFSAlgorithm.ts
 * 【修复】接收 Dimension + Vector3 + targetTypeId，不再依赖 Block 对象
 */
const DEFAULT_DIRECTIONS = [
    { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
];

/** 26面方向（含对角线），用于原木连锁以覆盖金合欢等斜向生长的树 */
const DIRECTIONS_26 = [];
for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
            if (dx === 0 && dy === 0 && dz === 0) continue;
            DIRECTIONS_26.push({ x: dx, y: dy, z: dz });
        }
    }
}
function coordKey(x, y, z) {
    return `${x}|${y}|${z}`;
}
export function bfsScan(dimension, startLocation, options) {
    const startTime = Date.now();
    const directions = options.directions ?? (options.use26 ? DIRECTIONS_26 : DEFAULT_DIRECTIONS);
    const targetTypeId = options.targetTypeId;
    const sx = Math.floor(startLocation.x);
    const sy = Math.floor(startLocation.y);
    const sz = Math.floor(startLocation.z);
    const result = [{ x: sx, y: sy, z: sz }];
    const visited = new Set();
    visited.add(coordKey(sx, sy, sz));
    const queue = [{ x: sx, y: sy, z: sz }];
    let truncated = false;
    let timedOut = false;
    while (queue.length > 0) {
        if (Date.now() - startTime > options.timeoutMs) {
            timedOut = true;
            break;
        }
        if (result.length >= options.maxBlocks) {
            truncated = true;
            break;
        }
        const current = queue.shift();
        for (const dir of directions) {
            const nx = current.x + Math.floor(dir.x);
            const ny = current.y + Math.floor(dir.y);
            const nz = current.z + Math.floor(dir.z);
            const key = coordKey(nx, ny, nz);
            if (visited.has(key))
                continue;
            visited.add(key);
            let nextBlock;
            try {
                nextBlock = dimension.getBlock({ x: nx, y: ny, z: nz });
            }
            catch {
                continue;
            }
            if (!nextBlock)
                continue;
            if (nextBlock.typeId !== targetTypeId)
                continue;
            result.push({ x: nx, y: ny, z: nz });
            queue.push({ x: nx, y: ny, z: nz });
            if (result.length >= options.maxBlocks) {
                truncated = true;
                break;
            }
        }
        if (truncated)
            break;
    }
    return { blocks: result, truncated, timedOut, elapsedMs: Date.now() - startTime };
}
export function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
}
export function sortByDistance(blocks, origin) {
    return [...blocks].sort((a, b) => manhattanDistance(a, origin) - manhattanDistance(b, origin));
}

/**
 * 树叶扫描：在已找到的原木位置周围搜索树叶方块
 * @param dimension 维度
 * @param logPositions 已找到的原木坐标列表
 * @param leafTypeIds 树叶方块ID集合
 * @param maxRadius 搜索半径（曼哈顿距离）
 * @param maxLeaves 最大树叶数量
 * @returns 树叶坐标列表
 */
export function scanLeaves(dimension, logPositions, leafTypeIds, maxRadius, maxLeaves) {
    const leaves = [];
    const visited = new Set();
    for (const log of logPositions) {
        if (leaves.length >= maxLeaves) break;
        for (let dx = -maxRadius; dx <= maxRadius; dx++) {
            for (let dy = -maxRadius; dy <= maxRadius; dy++) {
                for (let dz = -maxRadius; dz <= maxRadius; dz++) {
                    if (leaves.length >= maxLeaves) break;
                    const dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
                    if (dist > maxRadius || dist === 0) continue;
                    const nx = log.x + dx;
                    const ny = log.y + dy;
                    const nz = log.z + dz;
                    const key = coordKey(nx, ny, nz);
                    if (visited.has(key)) continue;
                    visited.add(key);
                    // 跳过已知原木位置
                    if (logPositions.some(p => p.x === nx && p.y === ny && p.z === nz)) continue;
                    try {
                        const block = dimension.getBlock({ x: nx, y: ny, z: nz });
                        if (block && leafTypeIds.has(block.typeId)) {
                            leaves.push({ x: nx, y: ny, z: nz });
                        }
                    } catch { /* ignore */ }
                }
            }
        }
    }
    return leaves;
}
