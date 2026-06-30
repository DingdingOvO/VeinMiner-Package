/**
 * main.ts — VeinMiner 行为包入口
 *
 * 触发方式：
 *   - 潜行 + 挖方块 → 连锁采集
 *   - 聊天 #vm → 打开设置
 *   - 聊天 #vm on/off → 开关连锁
 *   - /scriptevent veinminer:toggle → 开关（HUD按钮预留）
 *   - /scriptevent veinminer:settings → 设置（HUD按钮预留）
 */

import { world, system } from '@minecraft/server';
import { registerVeinMiner } from './core';
import { registerChatHandler, registerScriptEventHandler } from './ui';
import { CHAT_PREFIX } from './config';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  启动
// ═══════════════════════════════════════

console.warn('[VM] VeinMiner v0.1.0 启动中...');

registerVeinMiner();
registerChatHandler();
registerScriptEventHandler();

console.warn('[VM] 启动完成');

// 在线玩家提示
system.run(() => {
    for (const player of world.getAllPlayers()) {
        player.onScreenDisplay.setActionBar(
            `${TAG} §a已加载 §7| §f潜行+挖掘 连锁 §7| §f${CHAT_PREFIX} 设置`,
        );
    }
});