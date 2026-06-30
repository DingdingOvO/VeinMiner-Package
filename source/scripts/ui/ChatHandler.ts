/**
 * ChatHandler.ts — 聊天命令拦截
 *
 * 2.8.0 稳定版没有 chatSend 事件，改用 afterEvents.chatSend：
 *   - 能监听到聊天消息
 *   - 无法取消（消息会显示在聊天框）
 *   - 用 ActionBar 反馈，玩家体验仍然可用
 *
 * 如果 afterEvents.chatSend 也不存在则静默跳过。
 *
 * 命令：
 *   #vm        → 打开设置
 *   #vm on     → 开启连锁
 *   #vm off    → 关闭连锁
 */

import { world } from '@minecraft/server';
import {
    setPlayerToggle,
    CHAT_PREFIX,
} from '../config';
import { showSettings } from './SettingsForm';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  注册
// ═══════════════════════════════════════

export function registerChatHandler(): void {
    const afterEvents = world.afterEvents as unknown as Record<string, { subscribe: (cb: (e: { message: string; sender: import('@minecraft/server').Player }) => void) => void }>;
    const chatSend = afterEvents['chatSend'];

    if (!chatSend) {
        console.warn('[VM] chatSend 事件不可用，跳过聊天命令注册。请使用 /scriptevent veinminer:settings');
        return;
    }

    chatSend.subscribe((event) => {
        const message = event.message.trim();
        if (!message.startsWith(CHAT_PREFIX)) return;

        const sender = event.sender;
        const args = message.slice(CHAT_PREFIX.length).trim();

        if (args === '' || args === 'set' || args === 'settings') {
            showSettings(sender);
        } else if (args === 'on') {
            setPlayerToggle(sender, true);
            sender.onScreenDisplay.setActionBar(`${TAG} §a连锁采集 已开启`);
        } else if (args === 'off') {
            setPlayerToggle(sender, false);
            sender.onScreenDisplay.setActionBar(`${TAG} §c连锁采集 已关闭`);
        } else {
            sender.onScreenDisplay.setActionBar(
                `${TAG} §7#vm §f设置 §7| §f#vm on §7| §f#vm off`,
            );
        }
    });
}