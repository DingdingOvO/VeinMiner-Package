/**
 * performance/index.ts
 * 职责：性能参数统一导出
 */
export * from './MaxVeinDefault';
export * from './BlocksPerTick';
export * from './ScanTimeoutMs';
export * from './TpsThreshold';
export * from './YieldInterval';
export * from './MaxConcurrentTasks';
import { MAX_VEIN_DEFAULT } from './MaxVeinDefault';
import { BLOCKS_PER_TICK } from './BlocksPerTick';
import { SCAN_TIMEOUT_MS } from './ScanTimeoutMs';
import { TPS_THRESHOLD } from './TpsThreshold';
import { YIELD_INTERVAL } from './YieldInterval';
import { MAX_CONCURRENT_TASKS } from './MaxConcurrentTasks';
/** 性能参数聚合 */
export const PERFORMANCE_CONFIG = {
    maxVeinDefault: MAX_VEIN_DEFAULT,
    blocksPerTick: BLOCKS_PER_TICK,
    scanTimeoutMs: SCAN_TIMEOUT_MS,
    tpsThreshold: TPS_THRESHOLD,
    yieldInterval: YIELD_INTERVAL,
    maxConcurrentTasks: MAX_CONCURRENT_TASKS
};
