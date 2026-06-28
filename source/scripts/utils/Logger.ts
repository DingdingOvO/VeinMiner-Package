/**
 * Logger.ts
 * 输出到 Minecraft 创造者控制台 (设置 > 创造者 > 脚本日志)
 */

import { world } from '@minecraft/server';

export enum LogLevel {
    DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3
}

export class Logger {
    private static level: LogLevel = LogLevel.INFO;
    private static readonly PREFIX = '[VeinMiner]';
    private static _tick = 0;

    public static setLevel(level: LogLevel): void { Logger.level = level; }
    public static tick(t: number): void { Logger._tick = t; }

    private static ts(): string { return `[T${Logger._tick}]`; }

    public static debug(msg: string, ...args: unknown[]): void {
        if (Logger.level <= LogLevel.DEBUG) console.log(`${Logger.PREFIX} [DEBUG] ${Logger.ts()} ${msg}`, ...args);
    }

    public static info(msg: string, ...args: unknown[]): void {
        if (Logger.level <= LogLevel.INFO) console.log(`${Logger.PREFIX} [INFO] ${Logger.ts()} ${msg}`, ...args);
    }

    public static warn(msg: string, ...args: unknown[]): void {
        if (Logger.level <= LogLevel.WARN) console.warn(`${Logger.PREFIX} [WARN] ${Logger.ts()} ${msg}`, ...args);
    }

    public static error(msg: string, ...args: unknown[]): void {
        if (Logger.level <= LogLevel.ERROR) console.error(`${Logger.PREFIX} [ERROR] ${Logger.ts()} ${msg}`, ...args);
    }

    public static player(player: { sendMessage: (msg: string) => void }, message: string): void {
        try { player.sendMessage(message); } catch (err) { Logger.error('向玩家发送消息失败', err); }
    }

    public static broadcastOp(message: string): void {
        try {
            for (const p of world.getAllPlayers()) {
                if ((p as unknown as { isOp?: () => boolean }).isOp?.() ?? true) p.sendMessage(message);
            }
        } catch (err) { Logger.error('广播 OP 失败', err); }
    }
}
