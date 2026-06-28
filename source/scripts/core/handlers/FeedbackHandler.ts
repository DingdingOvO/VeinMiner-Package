/**
 * FeedbackHandler.ts
 * 职责：向玩家发送操作反馈（消息、声音、粒子）
 */

import { Player } from '@minecraft/server';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';

export class FeedbackHandler {
    /**
     * 发送普通信息
     */
    public info(player: Player, key: string, ...args: unknown[]): void {
        try {
            const msg = I18n.for(player, key, ...args);
            player.sendMessage(`§a${msg}§r`);
        } catch (err) {
            Logger.error('FeedbackHandler.info 失败', err);
        }
    }

    /**
     * 发送警告
     */
    public warn(player: Player, key: string, ...args: unknown[]): void {
        try {
            const msg = I18n.for(player, key, ...args);
            player.sendMessage(`§e${msg}§r`);
        } catch (err) {
            Logger.error('FeedbackHandler.warn 失败', err);
        }
    }

    /**
     * 发送错误
     */
    public error(player: Player, key: string, ...args: unknown[]): void {
        try {
            const msg = I18n.for(player, key, ...args);
            player.sendMessage(`§c${msg}§r`);
        } catch (err) {
            Logger.error('FeedbackHandler.error 失败', err);
        }
    }
}
