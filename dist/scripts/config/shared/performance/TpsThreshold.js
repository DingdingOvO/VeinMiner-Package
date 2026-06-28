/**
 * TpsThreshold.ts
 * 职责：TPS 阈值，低于此值视为过载
 */
export const TPS_THRESHOLD = 15;
export function getTpsThreshold() {
    return TPS_THRESHOLD;
}
