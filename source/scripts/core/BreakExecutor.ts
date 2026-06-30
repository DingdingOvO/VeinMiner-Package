/**
 * BreakExecutor.ts — 分 tick 队列破坏执行
 *
 * 设计要点：
 *   - 每个玩家独立队列（Map<playerId, state>），多人互不影响
 *   - 同一玩家挖新矿时直接替换队列，旧任务立即作废
 *   - 每 tick 执行 BATCH_SIZE 个方块，不卡服
 *   - 耐久逐个消耗，损坏立即停止
 */

import { Player, Dimension, Vector3, system } from '@minecraft/server';
import { Pos, sortByDistance } from './Scanner';
import { getHeldTool, consumeDurability } from '../utils';

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
    tool: ReturnType<typeof getHeldTool>;
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
    dimension: Dimension,
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
        tool: getHeldTool(player),
    });

    // 如果该玩家没有在跑的循环，启动一个
    const state = playerQueues.get(pid)!;
    if (!state.running) {
        state.running = true;
        processTick(player, dimension, pid);
    }
}

// ═══════════════════════════════════════
//  内部：每 tick 处理一批
// ═══════════════════════════════════════

function processTick(player: Player, dimension: Dimension, pid: string): void {
    const state = playerQueues.get(pid);

    // 队列被清空（玩家下线或被替换后清理）
    if (!state || state.blocks.length === 0) {
        finishPlayer(pid, player, state);
        return;
    }

    // 取出一批
    const batch = state.blocks.splice(0, BATCH_SIZE);

    for (const pos of batch) {
        // 耐久检查
        if (state.tool.durability) {
            const isBroken = consumeDurability(state.tool);
            if (isBroken) {
                player.onScreenDisplay.setActionBar(`${TAG} §c工具已损坏`);
                state.blocks = []; // 清空队列，下次 tick 会结束
                break;
            }
        }

        try {
            dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air destroy`);
            state.broken++;
        } catch {
            // 方块已被其他方式破坏
        }
    }

    // 还有剩余 → 下一 tick 继续
    if (state.blocks.length > 0) {
        system.run(() => processTick(player, dimension, pid));
    } else {
        finishPlayer(pid, player, state);
    }
}

// ═══════════════════════════════════════
//  内部：玩家任务完成/中断
// ═══════════════════════════════════════

function finishPlayer(pid: string, player: Player, state: QueueState | undefined): void {
    playerQueues.delete(pid);

    if (state && state.broken > 0) {
        player.onScreenDisplay.setActionBar(`${TAG} §a+${state.broken} 方块`);

        if (state.collectDrops) {
            collectDropsToOrigin(player.dimension, state.origin);
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