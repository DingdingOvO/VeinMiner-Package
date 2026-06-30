/**
 * ChatHandler.ts — 聊天命令拦截
 *
 * 拦截 #vm 开头的聊天消息：
 *   #vm        → 打开设置
 *   #vm on     → 开启连锁
 *   #vm off    → 关闭连锁
 *
 * 注意：chatSend 在 @minecraft/server 2.8.0 稳定版类型中未导出，
 * 但运行时可用，此处用类型断言访问。
 */

import { world } from '@minecraft/server';
import {
    setPlayerToggle,
    CHAT_PREFIX,
} from '../config';
import { showSettings } from './SettingsForm';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  类型（运行时存在但 2.8.0 稳定版 d.ts 未导出）
// ═══════════════════════════════════════

interface ChatSendBeforeEvent {
    message: string;
    sender: import('@minecraft/server').Player;
    cancel: boolean;
}

interface ChatSendBeforeEventSignal {
    subscribe(callback: (event: ChatSendBeforeEvent) => void): void;
}

// ═══════════════════════════════════════
//  注册
// ═══════════════════════════════════════

export function registerChatHandler(): void {
    const beforeEvents = world.beforeEvents as unknown as {
        chatSend: ChatSendBeforeEventSignal;
    };

    beforeEvents.chatSend.subscribe((event) => {
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