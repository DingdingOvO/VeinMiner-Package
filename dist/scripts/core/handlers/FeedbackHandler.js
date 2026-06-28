/**
 * FeedbackHandler.ts
 * 职责：向玩家发送操作反馈（actionbar 显示在快捷栏上方）
 *
 * actionbar 只显示一行，会被覆盖，所以：
 * - 连锁过程中不打扰（已移除 connected 消息）
 * - 只在完成/出错时显示简洁的一行提示
 * - 格式: §8[VM]§r 前缀 + 对应颜色内容
 */
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
/** actionbar 前缀标签 */
const TAG = '§8[VM]§r';
export class FeedbackHandler {
    /**
     * 发送普通信息（绿色）
     */
    info(player, key, ...args) {
        try {
            const msg = I18n.for(player, key, ...args);
            player.onScreenDisplay.setActionBar(`${TAG} §a${msg}§r`);
        }
        catch (err) {
            Logger.error('FeedbackHandler.info 失败', err);
        }
    }
    /**
     * 发送警告（黄色）
     */
    warn(player, key, ...args) {
        try {
            const msg = I18n.for(player, key, ...args);
            player.onScreenDisplay.setActionBar(`${TAG} §e${msg}§r`);
        }
        catch (err) {
            Logger.error('FeedbackHandler.warn 失败', err);
        }
    }
    /**
     * 发送错误（红色）
     */
    error(player, key, ...args) {
        try {
            const msg = I18n.for(player, key, ...args);
            player.onScreenDisplay.setActionBar(`${TAG} §c${msg}§r`);
        }
        catch (err) {
            Logger.error('FeedbackHandler.error 失败', err);
        }
    }
}
