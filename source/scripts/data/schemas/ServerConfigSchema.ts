/**
 * ServerConfigSchema.ts
 * 职责：服务端配置 schema 定义（镜像 ServerConfigData）
 */

export interface ServerConfigSchema {
    version: number;
    blacklist: string[];
    whitelistExtra: string[];
    blockLimits: Record<string, number>;
    defaultLimit: number;
    rateLimit: { perSecond: number; perTick: number };
    dimensions: {
        overworld: { enabled: boolean; multiplier: number };
        nether: { enabled: boolean; multiplier: number };
        end: { enabled: boolean; multiplier: number };
    };
    playerOverride: {
        allowToggle: boolean;
        allowMaxVein: boolean;
        allowWhitelist: boolean;
    };
    cooldown: { personalSec: number; globalSec: number };
}

export const SERVER_CONFIG_VERSION = 1;
