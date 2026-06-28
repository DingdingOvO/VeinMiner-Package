/**
 * PerformanceGuard.ts
 * 职责：性能监控与过载保护
 */
export class PerformanceGuard {
    static TPS_THRESHOLD = 15;
    static MAX_CONCURRENT = 8;
    static MAX_BLOCKS_PER_SECOND = 256;
    static lastTickTime = Date.now();
    static smoothedTps = 20;
    static activeTaskCount = 0;
    static blockBreakTimes = [];
    static onTick() {
        const now = Date.now();
        const delta = now - this.lastTickTime;
        this.lastTickTime = now;
        if (delta > 0) {
            const instant = Math.min(1000 / delta, 20);
            this.smoothedTps = this.smoothedTps * 0.7 + instant * 0.3;
        }
    }
    static getStatus() {
        const oneSecAgo = Date.now() - 1000;
        this.blockBreakTimes = this.blockBreakTimes.filter(t => t > oneSecAgo);
        return {
            tps: Math.round(this.smoothedTps * 10) / 10,
            activeTasks: this.activeTaskCount,
            blocksLastSecond: this.blockBreakTimes.length,
            overloaded: this.isOverloaded()
        };
    }
    static isOverloaded() {
        return this.smoothedTps < this.TPS_THRESHOLD ||
            this.activeTaskCount >= this.MAX_CONCURRENT ||
            this.blockBreakTimes.length >= this.MAX_BLOCKS_PER_SECOND;
    }
    static taskStarted() { this.activeTaskCount++; }
    static taskFinished() { this.activeTaskCount = Math.max(0, this.activeTaskCount - 1); }
    static recordBlockBreak() { this.blockBreakTimes.push(Date.now()); }
    static canStartNewTask() { return !this.isOverloaded(); }
}
