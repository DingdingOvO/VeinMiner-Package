/**
 * TimeHelper.ts
 * 职责：时间相关辅助函数
 */
export class TimeHelper {
    /** 当前毫秒时间戳 */
    static now() {
        return Date.now();
    }
    /** 当前 tick（来自 system.currentTick） */
    static currentTick() {
        // 在 main.ts 中初始化后可通过此函数访问
        return TimeHelper._tickCounter;
    }
    /** 内部 tick 计数器 */
    static _tickCounter = 0;
    /** 由 main.ts 在 system.runInterval 中调用 */
    static _advanceTick() {
        TimeHelper._tickCounter++;
    }
    /** 格式化毫秒为秒 */
    static msToSec(ms) {
        return Math.ceil(ms / 1000);
    }
    /** 是否冷却结束 */
    static isCooldownPassed(lastTime, cooldownMs) {
        return (Date.now() - lastTime) >= cooldownMs;
    }
    /** 剩余冷却秒数 */
    static remainingSec(lastTime, cooldownMs) {
        const elapsed = Date.now() - lastTime;
        const remaining = cooldownMs - elapsed;
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }
}
