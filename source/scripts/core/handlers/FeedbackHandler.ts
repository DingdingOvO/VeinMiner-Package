/**
 * FeedbackHandler.ts
 * 职责：向玩家发送操作反馈（actionbar 显示在快捷栏上方）
 *
 * actionbar 只显示一行，会被覆盖，所以：
 * - 连锁过程中不打扰（已移除 connected 消息）
 * - 只在完成/出错时显示简洁的一行提示
 * - 使用 rawtext translate/with，游戏引擎自动选语言
 */

import { Player } from '@minecraft/server';
import { Lang } from '../../utils/Lang';
import { Logger } from '../../utils/Logger';

export class FeedbackHandler {
    /**
     * 发送普通信息（绿色）
     */
    public info(player: Player, key: string, ...args: (string | number)[]): void {
        try {
            Lang.actionBar(player, '§a', key, ...args);
        } catch (err) {
            Logger.error('FeedbackHandler.info 失败', err);
        }
    }

    /**
     * 发送警告（黄色）
     */
    public warn(player: Player, key: string, ...args: (string | number)[]): void {
        try {
            Lang.actionBar(player, '§e', key, ...args);
        } catch (err) {
            Logger.error('FeedbackHandler.warn 失败', err);
        }
    }

    /**
     * 发送错误（红色）
     */
    public error(player: Player, key: string, ...args: (string | number)[]): void {
        try {
            Lang.actionBar(player, '§c', key, ...args);
        } catch (err) {
            Logger.error('FeedbackHandler.error 失败', err);
        }
    }
}