/**
 * FeedbackHandler.ts
 * 职责：向玩家发送操作反馈（actionbar 显示在快捷栏上方）
 */
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
export class FeedbackHandler {
    /**
     * 发送普通信息
     */
    info(player, key, ...args) {
        try {
            const msg = I18n.for(player, key, ...args);
            player.onScreenDisplay.setActionBar(`§a${msg}§r`);
        }
        catch (err) {
            Logger.error('FeedbackHandler.info 失败', err);
        }
    }
    /**
     * 发送警告
     */
    warn(player, key, ...args) {
        try {
            const msg = I18n.for(player, key, ...args);
            player.onScreenDisplay.setActionBar(`§e${msg}§r`);
        }
        catch (err) {
            Logger.error('FeedbackHandler.warn 失败', err);
        }
    }
    /**
     * 发送错误
     */
    error(player, key, ...args) {
        try {
            const msg = I18n.for(player, key, ...args);
            player.onScreenDisplay.setActionBar(`§c${msg}§r`);
        }
        catch (err) {
            Logger.error('FeedbackHandler.error 失败', err);
        }
    }
}