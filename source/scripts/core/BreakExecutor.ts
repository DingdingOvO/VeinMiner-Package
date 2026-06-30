/**
 * BreakExecutor.ts — 方块破坏执行
 *
 * 负责实际的方块破坏、耐久消耗、掉落物集中
 */

import { Player, Dimension, Vector3, system } from '@minecraft/server';
import { Pos, sortByDistance } from './Scanner';
import { getHeldTool, consumeDurability } from '../utils';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  执行破坏
// ═══════════════════════════════════════

/**
 * 批量破坏方块
 * @param player         玩家
 * @param dimension      维度
 * @param blocks         要破坏的方块坐标（不含起点，起点由玩家正常破坏）
 * @param leafBlocks     树叶方块坐标（可选）
 * @param origin         起点坐标（用于距离排序和掉落物集中）
 * @param collectDrops   是否集中掉落物
 */
export function executeBreak(
    player: Player,
    dimension: Dimension,
    blocks: Pos[],
    leafBlocks: Pos[],
    origin: Vector3,
    collectDrops: boolean,
): void {
    const tool = getHeldTool(player);
    const sorted = sortByDistance(blocks, origin);
    const sortedLeaves = sortByDistance(leafBlocks, origin);
    const allPos = [...sorted, ...sortedLeaves];

    let broken = 0;

    for (const pos of allPos) {
        // 耐久消耗
        if (tool.durability) {
            const broken_ = consumeDurability(tool);
            if (broken_) {
                player.onScreenDisplay.setActionBar(`${TAG} §c工具已损坏`);
                break;
            }
        }

        try {
            dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air destroy`);
            broken++;
        } catch {
            // 方块已被其他方式破坏
        }
    }

    if (broken > 0) {
        player.onScreenDisplay.setActionBar(`${TAG} §a+${broken} 方块`);
        if (collectDrops) {
            collectDropsToOrigin(dimension, allPos, origin);
        }
    }
}

// ═══════════════════════════════════════
//  掉落物集中
// ═══════════════════════════════════════

function collectDropsToOrigin(
    dimension: Dimension,
    positions: Pos[],
    target: Vector3,
): void {
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