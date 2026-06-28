/**
 * CommandBase.ts
 * 职责：命令基类，所有 /vein 子命令继承此类
 */

import { Player } from '@minecraft/server';
import { Lang } from '../utils/Lang';

/** 命令执行上下文 */
export interface CommandContext {
    /** 执行玩家 */
    player: Player;
    /** 完整命令参数（不含 /vein 前缀） */
    args: string[];
}

/** 命令元信息 */
export interface CommandMeta {
    /** 子命令名（如 toggle, status, blacklist） */
    name: string;
    /** 简短描述 */
    description: string;
    /** 用法示例（翻译 key） */
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
            Lang.msg(ctx.player, 'veinminer.cmd.onlyOp');
            return false;
        }
        return true;
    }

    /**
     * 判断玩家是否为 OP（安全优先返回 false）
     */
    protected isOp(player: Player): boolean {
        try {
            return (player as unknown as { isOp?: () => boolean }).isOp?.() ?? false;
        } catch {
            return false;
        }
    }

    /**
     * 发送翻译反馈消息（无参数）
     */
    protected feedback(ctx: CommandContext, key: string): void {
        Lang.msg(ctx.player, key);
    }

    /**
     * 发送翻译反馈消息（带位置参数）
     */
    protected feedbackF(ctx: CommandContext, key: string, ...args: (string | number)[]): void {
        Lang.msgF(ctx.player, key, ...args);
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