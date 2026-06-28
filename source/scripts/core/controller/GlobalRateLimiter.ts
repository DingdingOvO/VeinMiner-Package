/**
 * GlobalRateLimiter.ts
 * 职责：全服速率限制器（令牌桶）
 */

import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class GlobalRateLimiter {
    private tokens: number;
    private lastRefillTime: number = Date.now();
    private registry = ConfigRegistry.getInstance();

    constructor() {
        const limit = this.registry.isServerMode()
            ? this.registry.getServerRegistry().getRateLimit().perSecond
            : 256;
        this.tokens = limit;
    }

    /**
     * 尝试获取令牌
     */
    public tryAcquire(): boolean {
        try {
            this.refill();
            if (this.tokens >= 1) {
                this.tokens -= 1;
                return true;
            }
            return false;
        } catch (err) {
            Logger.error('速率限制检查失败', err);
            return true; // 失败时放行，避免影响体验
        }
    }

    /**
     * 补充令牌
     */
    private refill(): void {
        const now = Date.now();
        const elapsed = (now - this.lastRefillTime) / 1000;
        const limit = this.registry.isServerMode()
            ? this.registry.getServerRegistry().getRateLimit().perSecond
            : 256;
        this.tokens = Math.min(limit, this.tokens + elapsed * limit);
        this.lastRefillTime = now;
    }
}
