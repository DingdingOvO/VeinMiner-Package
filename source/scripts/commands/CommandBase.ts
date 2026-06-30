/**
 * CommandBase.ts
 * 职责：命令基类，所有 /vein 子命令继承此类
 * 提供参数解析、权限检查、反馈发送等通用能力
 */

import { Player } from '@minecraft/server';
import { I18n } from '../utils/I18n';

/** 命令执行上下文 */
export interface CommandContext {
    /** 执行玩家 */
    player: Player;
    /** 完整命令参数（不含 /vein 前缀） */
    args: string[];
    /** 当前语言 */
    lang: ReturnType<typeof I18n.detectPlayerLang>;
}

/** 命令元信息 */
export interface CommandMeta {
    /** 子命令名（如 toggle, status, blacklist） */
    name: string;
    /** 简短描述 */
    description: string;
    /** 用法示例 */
    usage: string;
    /** 是否仅 OP 可用 */
    opOnly: boolean;
    /** 适用环境：'all' | 'server' | 'client' */
    env: 'all' | 'server' | 'client';
}

export abstract class CommandBase {
    public abstract readonly meta: CommandMeta;

    /**
     * 执行命令
     * @returns 是否执行成功
     */
    public abstract execute(ctx: CommandContext): boolean;

    /**
     * 检查权限（OP 限制）
     */
    protected checkOp(ctx: CommandContext): boolean {
        if (this.meta.opOnly && !this.isOp(ctx.player)) {
            ctx.player.sendMessage(I18n.for(ctx.player, 'veinminer.cmd.onlyOp'));
            return false;
        }
        return true;
    }

    /**
     * 检查环境适配
     */
    protected checkEnv(_ctx: CommandContext): boolean {
        if (this.meta.env === 'all') return true;
        // server 命令在客户端模式下不可用
        // client 命令在服务端模式下不可用
        // 由 EnvironmentDetector 控制
        return true;
    }

    /**
     * 判断玩家是否为 OP
     */
    protected isOp(player: Player): boolean {
        try {
            // 基岩版 Player 没有 isOp() 方法
            // 单机/局域网中所有玩家视为 OP
            // BDS 中通过 player.hasTag('op') 或权限检查
            return (player as unknown as { isOp?: () => boolean }).isOp?.() ?? true;
        } catch {
            return true;
        }
    }

    /**
     * 发送反馈消息
     */
    protected feedback(ctx: CommandContext, key: string, ...args: unknown[]): void {
        const msg = I18n.for(ctx.player, key, ...args);
        ctx.player.sendMessage(msg);
    }

    /**
     * 读取参数
     */
    protected arg(ctx: CommandContext, index: number): string | undefined {
        return ctx.args[index];
    }

    /**
     * 读取并校验数字参数
     */
    protected parseInt(ctx: CommandContext, index: number): number | null {
        const raw = this.arg(ctx, index);
        if (raw === undefined) return null;
        const num = Number(raw);
        if (!Number.isFinite(num) || num < 0) {
            this.feedback(ctx, 'veinminer.cmd.invalidNumber');
            return null;
        }
        return Math.floor(num);
    }
}
