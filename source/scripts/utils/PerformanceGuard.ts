/**
 * PerformanceGuard.ts
 * 职责：性能监控与过载保护
 */

export interface PerformanceStatus {
    tps: number;
    activeTasks: number;
    blocksLastSecond: number;
    overloaded: boolean;
}

export class PerformanceGuard {
    public static TPS_THRESHOLD = 15;
    public static MAX_CONCURRENT = 8;
    public static MAX_BLOCKS_PER_SECOND = 256;
    private static lastTickTime: number = Date.now();
    private static smoothedTps: number = 20;
    private static activeTaskCount: number = 0;
    private static blockBreakTimes: number[] = [];

    public static onTick(): void {
        const now = Date.now();
        const delta = now - this.lastTickTime;
        this.lastTickTime = now;
        if (delta > 0) {
            const instant = Math.min(1000 / delta, 20);
            this.smoothedTps = this.smoothedTps * 0.7 + instant * 0.3;
        }
    }

    public static getStatus(): PerformanceStatus {
        const oneSecAgo = Date.now() - 1000;
        this.blockBreakTimes = this.blockBreakTimes.filter(t => t > oneSecAgo);
        return {
            tps: Math.round(this.smoothedTps * 10) / 10,
            activeTasks: this.activeTaskCount,
            blocksLastSecond: this.blockBreakTimes.length,
            overloaded: this.isOverloaded()
        };
    }

    public static isOverloaded(): boolean {
        return this.smoothedTps < this.TPS_THRESHOLD ||
               this.activeTaskCount >= this.MAX_CONCURRENT ||
               this.blockBreakTimes.length >= this.MAX_BLOCKS_PER_SECOND;
    }

    public static taskStarted(): void { this.activeTaskCount++; }
    public static taskFinished(): void { this.activeTaskCount = Math.max(0, this.activeTaskCount - 1); }
    public static recordBlockBreak(): void { this.blockBreakTimes.push(Date.now()); }
    public static canStartNewTask(): boolean { return !this.isOverloaded(); }
}
