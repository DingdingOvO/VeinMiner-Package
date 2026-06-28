/**
 * CommandBase.ts
 * 职责：命令基类，所有 /vein 子命令继承此类
 * 提供参数解析、权限检查、反馈发送等通用能力
 */
import { I18n } from '../utils/I18n';
export class CommandBase {
    /**
     * 检查权限（OP 限制）
     */
    checkOp(ctx) {
        if (this.meta.opOnly && !this.isOp(ctx.player)) {
            ctx.player.sendMessage(I18n.for(ctx.player, 'veinminer.cmd.onlyOp'));
            return false;
        }
        return true;
    }
    /**
     * 检查环境适配
     */
    checkEnv(_ctx) {
        if (this.meta.env === 'all')
            return true;
        // server 命令在客户端模式下不可用
        // client 命令在服务端模式下不可用
        // 由 EnvironmentDetector 控制
        return true;
    }
    /**
     * 判断玩家是否为 OP
     */
    isOp(player) {
        try {
            // 基岩版 Player 没有 isOp() 方法
            // 单机/局域网中所有玩家视为 OP
            // BDS 中通过 player.hasTag('op') 或权限检查
            return player.isOp?.() ?? true;
        }
        catch {
            return true;
        }
    }
    /**
     * 发送反馈消息
     */
    feedback(ctx, key, ...args) {
        const msg = I18n.for(ctx.player, key, ...args);
        ctx.player.sendMessage(msg);
    }
    /**
     * 读取参数
     */
    arg(ctx, index) {
        return ctx.args[index];
    }
    /**
     * 读取并校验数字参数
     */
    parseInt(ctx, index) {
        const raw = this.arg(ctx, index);
        if (raw === undefined)
            return null;
        const num = Number(raw);
        if (!Number.isFinite(num) || num < 0) {
            this.feedback(ctx, 'veinminer.cmd.invalidNumber');
            return null;
        }
        return Math.floor(num);
    }
}
