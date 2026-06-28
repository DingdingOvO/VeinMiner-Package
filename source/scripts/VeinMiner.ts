/**
 * VeinMiner.ts — 核心连锁采集逻辑
 *
 * 监听 beforeEvents.playerBreakBlock → BFS 扫描 → 一 tick 全破 → 掉落物集中
 * 耐久消耗支持精准采集 / 时运附魔折扣
 */

import { world, Player, PlayerBreakBlockBeforeEvent, system, Dimension, Vector3, ItemStack } from '@minecraft/server';
import { bfsScan, scanLeaves, sortByDistance, Pos } from './BFS';
import {
    isWhitelisted, isBlacklisted, isLogType,
    getPlayerToggle, getPlayerMaxVein, getPlayerCollectDrops,
    getLeafIdSet, SCAN_TIMEOUT_MS, LEAF_SCAN_RADIUS, LEAF_MAX_COUNT,
} from './Config';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  注册
// ═══════════════════════════════════════

export function registerVeinMiner(): void {
    world.beforeEvents.playerBreakBlock.subscribe(onBreak);
    console.warn('[VM] 事件监听已注册 (beforeEvents.playerBreakBlock)');
}

// ═══════════════════════════════════════
//  方块破坏事件
// ═══════════════════════════════════════

function onBreak(event: PlayerBreakBlockBeforeEvent): void {
    const player = event.player;
    if (!player.isSneaking) return;

    const block = event.block;
    const typeId = block.typeId;
    if (!isWhitelisted(typeId) || isBlacklisted(typeId)) return;
    if (!getPlayerToggle(player)) return;

    const startLoc: Vector3 = {
        x: Math.floor(block.location.x),
        y: Math.floor(block.location.y),
        z: Math.floor(block.location.z),
    };
    const dimension = block.dimension;
    const maxVein = getPlayerMaxVein(player);
    const isLog = isLogType(typeId);

    // BFS 扫描（包含起点方块）
    const result = bfsScan(dimension, startLoc, typeId, maxVein, SCAN_TIMEOUT_MS, isLog);
    if (result.timedOut) {
        player.onScreenDisplay.setActionBar(`${TAG} §e扫描超时`);
        return;
    }

    // 起点方块由玩家正常破坏，只处理剩余
    const extraBlocks = result.blocks.length > 1 ? result.blocks.slice(1) : [];

    // 原木自动带树叶
    let leafBlocks: Pos[] = [];
    if (isLog) {
        leafBlocks = scanLeaves(dimension, result.blocks, getLeafIdSet(), LEAF_SCAN_RADIUS, LEAF_MAX_COUNT);
    }

    if (extraBlocks.length === 0 && leafBlocks.length === 0) return;

    // 按距离排序
    const sorted = sortByDistance(extraBlocks, startLoc);
    const sortedLeaves = sortByDistance(leafBlocks, startLoc);

    // 下一 tick 执行（此时起点方块已被正常破坏）
    system.run(() => {
        executeBreak(player, dimension, sorted, sortedLeaves, startLoc);
    });
}

// ═══════════════════════════════════════
//  执行破坏
// ═══════════════════════════════════════

function executeBreak(
    player: Player,
    dimension: Dimension,
    blocks: Pos[],
    leafBlocks: Pos[],
    origin: Vector3,
): void {
    const { item, durability } = getHeldTool(player);
    const hasTool = !!durability;
    let broken = 0;
    const allPos = [...blocks, ...leafBlocks];

    for (const pos of allPos) {
        // 耐久消耗
        if (hasTool && durability && item) {
            if (durability.damage >= durability.maxDurability) {
                player.onScreenDisplay.setActionBar(`${TAG} §c工具已损坏`);
                break;
            }
            // 耐久附魔：每级 (level/(level+1)) 概率免消耗
            const unbreaking = getEnchantLevel(item, 'unbreaking');
            if (unbreaking > 0 && Math.random() < unbreaking / (unbreaking + 1)) {
                // 免消耗
            } else {
                durability.damage += 1;
            }
        }

        try {
            dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air destroy`);
            broken++;
        } catch { /* 方块已被其他方式破坏 */ }
    }

    if (broken > 0) {
        player.onScreenDisplay.setActionBar(`${TAG} §a+${broken} 方块`);
        if (getPlayerCollectDrops(player)) {
            collectDrops(dimension, allPos, origin);
        }
    }
}

// ═══════════════════════════════════════
//  掉落物集中
// ═══════════════════════════════════════

function collectDrops(dimension: Dimension, positions: Pos[], target: Vector3): void {
    system.run(() => {
        try {
            let maxDist = 5;
            for (const p of positions) {
                const dx = p.x - target.x;
                const dy = p.y - target.y;
                const dz = p.z - target.z;
                maxDist = Math.max(maxDist, Math.sqrt(dx * dx + dy * dy + dz * dz) + 3);
            }
            const items = dimension.getEntities({
                location: target,
                maxDistance: maxDist,
                type: 'minecraft:item',
            });
            for (const item of items) {
                try { item.teleport(target, { keepVelocity: false }); } catch { /* ignore */ }
            }
        } catch { /* ignore */ }
    });
}

// ═══════════════════════════════════════
//  工具与附魔工具函数
// ═══════════════════════════════════════

interface ToolInfo {
    item: ItemStack | undefined;
    durability: { damage: number; maxDurability: number } | undefined;
}

/** 获取玩家主手工具及耐久组件 */
function getHeldTool(player: Player): ToolInfo {
    try {
        const equippable = player.getComponent('minecraft:equippable');
        if (!equippable) return { item: undefined, durability: undefined };
        const slot = equippable.getEquipmentSlot('Mainhand' as never) as unknown as {
            getItem?: () => ItemStack | undefined;
            setItem?: (item: ItemStack | undefined) => void;
        };
        const item = slot?.getItem?.();
        if (!item) return { item: undefined, durability: undefined };

        const dur = item.getComponent('minecraft:durability') as { damage: number; maxDurability: number } | undefined;
        return { item, durability: dur };
    } catch {
        return { item: undefined, durability: undefined };
    }
}

/** 读取附魔等级 */
function getEnchantLevel(item: ItemStack, enchantId: string): number {
    try {
        const comp = item.getComponent('minecraft:enchantable') as {
            getEnchantment?: (id: string) => { level: number } | undefined;
        } | undefined;
        return comp?.getEnchantment?.(enchantId)?.level ?? 0;
    } catch {
        return 0;
    }
}