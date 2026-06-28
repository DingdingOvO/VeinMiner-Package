/**
 * Logger.ts
 * 输出到 Minecraft 创造者控制台 (设置 > 创造者 > 脚本日志)
 */
import { world } from '@minecraft/server';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
export class Logger {
    static level = LogLevel.INFO;
    static PREFIX = '[VeinMiner]';
    static _tick = 0;
    static setLevel(level) { Logger.level = level; }
    static tick(t) { Logger._tick = t; }
    static ts() { return `[T${Logger._tick}]`; }
    static debug(msg, ...args) {
        if (Logger.level <= LogLevel.DEBUG)
            console.log(`${Logger.PREFIX} [DEBUG] ${Logger.ts()} ${msg}`, ...args);
    }
    static info(msg, ...args) {
        if (Logger.level <= LogLevel.INFO)
            console.log(`${Logger.PREFIX} [INFO] ${Logger.ts()} ${msg}`, ...args);
    }
    static warn(msg, ...args) {
        if (Logger.level <= LogLevel.WARN)
            console.warn(`${Logger.PREFIX} [WARN] ${Logger.ts()} ${msg}`, ...args);
    }
    static error(msg, ...args) {
        if (Logger.level <= LogLevel.ERROR)
            console.error(`${Logger.PREFIX} [ERROR] ${Logger.ts()} ${msg}`, ...args);
    }
    static player(player, message) {
        try {
            player.sendMessage(message);
        }
        catch (err) {
            Logger.error('向玩家发送消息失败', err);
        }
    }
    static broadcastOp(message) {
        try {
            for (const p of world.getAllPlayers()) {
                if (p.isOp?.() ?? true)
                    p.sendMessage(message);
            }
        }
        catch (err) {
            Logger.error('广播 OP 失败', err);
        }
    }
}
