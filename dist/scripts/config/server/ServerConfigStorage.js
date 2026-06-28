/**
 * ServerConfigStorage.ts
 * 职责：服务端配置持久化存储（基于 world DynamicProperty）
 * 所有 OP 修改的服务端配置都存储在 world 级别
 */
import { world } from '@minecraft/server';
import { Logger } from '../../utils/Logger';
/** 默认服务端配置 */
export const DEFAULT_SERVER_CONFIG = {
    blacklist: [
        'minecraft:bedrock',
        'minecraft:obsidian',
        'minecraft:command_block',
        'minecraft:structure_void',
        'minecraft:barrier'
    ],
    whitelistExtra: [],
    blockLimits: {},
    defaultLimit: 64,
    rateLimit: { perSecond: 256, perTick: 4 },
    dimensions: {
        overworld: { enabled: true, multiplier: 1.0 },
        nether: { enabled: true, multiplier: 0.8 },
        end: { enabled: true, multiplier: 0.5 }
    },
    playerOverride: {
        allowToggle: true,
        allowMaxVein: false,
        allowWhitelist: false
    },
    cooldown: { personalSec: 0, globalSec: 0 }
};
const PROPERTY_KEY = 'veinminer:server_config';
export class ServerConfigStorage {
    cached = null;
    /**
     * 加载服务端配置
     */
    load() {
        if (this.cached)
            return this.cached;
        try {
            const raw = world.getDynamicProperty(PROPERTY_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.cached = { ...DEFAULT_SERVER_CONFIG, ...parsed };
            }
            else {
                this.cached = { ...DEFAULT_SERVER_CONFIG };
            }
            return this.cached;
        }
        catch (err) {
            Logger.error('加载服务端配置失败，使用默认', err);
            this.cached = { ...DEFAULT_SERVER_CONFIG };
            return this.cached;
        }
    }
    /**
     * 保存服务端配置
     */
    save(data) {
        try {
            world.setDynamicProperty(PROPERTY_KEY, JSON.stringify(data));
            this.cached = data;
            Logger.info('服务端配置已保存');
        }
        catch (err) {
            Logger.error('保存服务端配置失败', err);
        }
    }
    /**
     * 重新加载（清除缓存）
     */
    reload() {
        this.cached = null;
        return this.load();
    }
    /**
     * 重置为默认
     */
    reset() {
        this.save({ ...DEFAULT_SERVER_CONFIG });
    }
}
