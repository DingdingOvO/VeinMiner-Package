/**
 * TimeHelper.ts
 * 职责：时间相关辅助函数
 */

export class TimeHelper {
    /** 当前毫秒时间戳 */
    public static now(): number {
        return Date.now();
    }

    /** 当前 tick（来自 system.currentTick） */
    public static currentTick(): number {
        // 在 main.ts 中初始化后可通过此函数访问
        return TimeHelper._tickCounter;
    }

    /** 内部 tick 计数器 */
    private static _tickCounter: number = 0;

    /** 由 main.ts 在 system.runInterval 中调用 */
    public static _advanceTick(): void {
        TimeHelper._tickCounter++;
    }

    /** 格式化毫秒为秒 */
    public static msToSec(ms: number): number {
        return Math.ceil(ms / 1000);
    }

    /** 是否冷却结束 */
    public static isCooldownPassed(lastTime: number, cooldownMs: number): boolean {
        return (Date.now() - lastTime) >= cooldownMs;
    }

    /** 剩余冷却秒数 */
    public static remainingSec(lastTime: number, cooldownMs: number): number {
        const elapsed = Date.now() - lastTime;
        const remaining = cooldownMs - elapsed;
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }
}
