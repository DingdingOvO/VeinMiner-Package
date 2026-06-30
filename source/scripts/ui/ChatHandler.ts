/**
 * ChatHandler.ts — 聊天命令拦截
 *
 * 拦截 #vm 开头的聊天消息：
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
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message.trim();
        if (!message.startsWith(CHAT_PREFIX)) return;

        // 取消聊天消息发送（不显示在聊天框）
        event.cancel = true;

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