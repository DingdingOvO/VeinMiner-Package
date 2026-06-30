/**
 * BreakExecutor.ts — 分 tick 队列破坏执行
 *
 * 设计要点：
 *   - 每个玩家独立队列（Map<playerId, state>），多人互不影响
 *   - 同一玩家挖新矿时直接替换队列，旧任务立即作废
 *   - 每 tick 执行 BATCH_SIZE 个方块，不卡服
 *   - 使用 player.runCommand 继承时运/精准采集等附魔
 *   - 耐久由游戏引擎自动处理，工具坏了 runCommand 自然抛错
 *   - 每 tick 重新查找玩家，防止引用失效
 */

import { world, system, Player, Dimension, Vector3 } from '@minecraft/server';
import { Pos, sortByDistance } from './Scanner';

const TAG = '§8[VM]§r';
const BATCH_SIZE = 20;

// ═══════════════════════════════════════
//  类型
// ═══════════════════════════════════════

interface QueueState {
    blocks: Pos[];
    running: boolean;
    broken: number;
    origin: Vector3;
    collectDrops: boolean;
}

/** playerId → 该玩家的破坏队列 */
const playerQueues = new Map<string, QueueState>();

// ═══════════════════════════════════════
//  对外接口
// ═══════════════════════════════════════

/**
 * 提交破坏任务
 * 如果该玩家已有未完成的任务，直接替换（旧任务作废）
 */
export function executeBreak(
    player: Player,
    _dimension: Dimension,
    blocks: Pos[],
    leafBlocks: Pos[],
    origin: Vector3,
    collectDrops: boolean,
): void {
    const pid = player.id;
    const sorted = sortByDistance(blocks, origin);
    const sortedLeaves = sortByDistance(leafBlocks, origin);
    const allPos = [...sorted, ...sortedLeaves];

    // 新建或替换该玩家的队列
    playerQueues.set(pid, {
        blocks: allPos,
        running: false,
        broken: 0,
        origin,
        collectDrops,
    });

    // 如果该玩家没有在跑的循环，启动一个
    const state = playerQueues.get(pid)!;
    if (!state.running) {
        state.running = true;
        processTick(pid);
    }
}

// ═══════════════════════════════════════
//  内部：每 tick 处理一批
// ═══════════════════════════════════════

function processTick(pid: string): void {
    const state = playerQueues.get(pid);

    // 队列被清空（玩家下线或被替换后清理）
    if (!state || state.blocks.length === 0) {
        finishPlayer(pid, state);
        return;
    }

    // 重新查找玩家（防止引用失效）
    const player = world.getPlayers().find(p => p.id === pid);
    if (!player) {
        playerQueues.delete(pid);
        return;
    }

    // 取出一批
    const batch = state.blocks.splice(0, BATCH_SIZE);

    for (const pos of batch) {
        try {
            // player.runCommand 继承时运/精准采集附魔，耐久由游戏引擎消耗
            player.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air destroy`);
            state.broken++;
        } catch {
            // 工具损坏 / 方块已被破坏 / 玩家下线 → 停止
            state.blocks = [];
            break;
        }
    }

    // 还有剩余 → 下一 tick 继续
    if (state.blocks.length > 0) {
        system.run(() => processTick(pid));
    } else {
        finishPlayer(pid, state);
    }
}

// ═══════════════════════════════════════
//  内部：玩家任务完成/中断
// ═══════════════════════════════════════

function finishPlayer(pid: string, state: QueueState | undefined): void {
    playerQueues.delete(pid);

    if (state && state.broken > 0) {
        const player = world.getPlayers().find(p => p.id === pid);
        if (player) {
            player.onScreenDisplay.setActionBar(`${TAG} §a+${state.broken} 方块`);

            if (state.collectDrops) {
                collectDropsToOrigin(player.dimension, state.origin);
            }
        }
    }
}

// ═══════════════════════════════════════
//  掉落物集中
// ═══════════════════════════════════════

function collectDropsToOrigin(dimension: Dimension, target: Vector3): void {
    system.run(() => {
        try {
            const maxDist = 6;
            const items = dimension.getEntities({
                location: target,
                maxDistance: maxDist,
                type: 'minecraft:item',
            });
            for (const item of items) {
                try {
                    item.teleport(target, { keepVelocity: false });
                } catch {
                    // 传送失败忽略
                }
            }
        } catch {
            // 整体异常忽略
        }
    });
}