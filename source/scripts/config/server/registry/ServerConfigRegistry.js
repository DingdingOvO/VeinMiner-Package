/**
 * ServerConfigRegistry.ts
 * 职责：服务端配置注册中心
 * 在服务端模式下，统一管理所有 OP 配置
 *
 * 服务端模式规则：
 * - 白名单 = 共享默认 + 服务端额外白名单（忽略个人白名单）
 * - 最大连锁数 = min(服务端方块限制, 共享默认) × 维度倍率
 * - 黑名单强制禁止
 * - 维度限制
 * - 速率限制
 * - 冷却限制
 * - 普通玩家仅可切换开关（由 AllowPlayerToggle 决定）
 */
import { ServerConfigStorage } from '../ServerConfigStorage';
import { getAllSharedWhitelist } from '../../shared/whitelist';
import { CollectionHelper } from '../../../lib/utils/CollectionHelper';
import { DEFAULT_BLOCK_LIMITS } from '../blocklimits';
import { MAX_VEIN_DEFAULT } from '../../shared/performance/MaxVeinDefault';
import { Logger } from '../../../utils/Logger';
export class ServerConfigRegistry {
    storage = new ServerConfigStorage();
    cached;
    constructor() {
        this.cached = this.storage.load();
    }
    /**
     * 获取有效白名单（共享默认 + 服务端额外白名单）
     */
    getEffectiveWhitelist(_player) {
        const shared = getAllSharedWhitelist();
        const extra = this.cached.whitelistExtra;
        return CollectionHelper.union(shared, extra);
    }
    /**
     * 获取有效最大连锁数 = min(方块上限, 共享默认) × 维度倍率
     */
    getEffectiveMaxVein(_player, blockId, dimensionId) {
        // 1. 取方块自定义上限或默认
        let limit = this.cached.defaultLimit;
        if (blockId && this.cached.blockLimits[blockId] !== undefined) {
            limit = this.cached.blockLimits[blockId];
        }
        else if (blockId && DEFAULT_BLOCK_LIMITS[blockId] !== undefined) {
            limit = DEFAULT_BLOCK_LIMITS[blockId];
        }
        // 2. 与共享默认取最小
        limit = Math.min(limit, MAX_VEIN_DEFAULT);
        // 3. 乘以维度倍率
        if (dimensionId) {
            const dimCfg = this.getDimensionConfig(dimensionId);
            limit = Math.floor(limit * dimCfg.multiplier);
        }
        return Math.max(1, limit);
    }
    /**
     * 是否在黑名单中
     */
    isBlacklisted(blockId) {
        return this.cached.blacklist.includes(blockId);
    }
    /**
     * 获取维度配置
     */
    getDimensionConfig(dimensionId) {
        if (dimensionId.includes('nether')) {
            return this.cached.dimensions.nether;
        }
        if (dimensionId.includes('the_end') || dimensionId.includes('end')) {
            return this.cached.dimensions.end;
        }
        return this.cached.dimensions.overworld;
    }
    /**
     * 获取个人开关（服务端模式下由 playerOverride.allowToggle 决定）
     */
    getPersonalToggle(player) {
        if (!this.cached.playerOverride.allowToggle)
            return false;
        // 启用的情况下读玩家偏好
        try {
            return player.getDynamicProperty('veinminer:personal_toggle') ?? true;
        }
        catch {
            return true;
        }
    }
    setPersonalToggle(player, value) {
        if (!this.cached.playerOverride.allowToggle)
            return;
        try {
            player.setDynamicProperty('veinminer:personal_toggle', value);
        }
        catch (err) {
            Logger.error('设置个人开关失败', err);
        }
    }
    /**
     * 获取速率限制
     */
    getRateLimit() {
        return this.cached.rateLimit;
    }
    /**
     * 获取冷却配置
     */
    getCooldown() {
        return this.cached.cooldown;
    }
    // ===== 各存储接口（供命令调用） =====
    getBlacklistStorage() {
        return {
            list: () => this.cached.blacklist,
            has: (id) => this.cached.blacklist.includes(id),
            add: (id) => {
                if (!this.cached.blacklist.includes(id)) {
                    this.cached.blacklist.push(id);
                    this.storage.save(this.cached);
                }
            },
            remove: (id) => {
                const idx = this.cached.blacklist.indexOf(id);
                if (idx >= 0) {
                    this.cached.blacklist.splice(idx, 1);
                    this.storage.save(this.cached);
                }
            }
        };
    }
    getWhitelistExtraStorage() {
        return {
            list: () => this.cached.whitelistExtra,
            has: (id) => this.cached.whitelistExtra.includes(id),
            add: (id) => {
                if (!this.cached.whitelistExtra.includes(id)) {
                    this.cached.whitelistExtra.push(id);
                    this.storage.save(this.cached);
                }
            },
            remove: (id) => {
                const idx = this.cached.whitelistExtra.indexOf(id);
                if (idx >= 0) {
                    this.cached.whitelistExtra.splice(idx, 1);
                    this.storage.save(this.cached);
                }
            }
        };
    }
    getBlockLimitsStorage() {
        return {
            list: () => ({ ...this.cached.blockLimits }),
            set: (id, value) => {
                this.cached.blockLimits[id] = value;
                this.storage.save(this.cached);
            },
            setDefault: (value) => {
                this.cached.defaultLimit = value;
                this.storage.save(this.cached);
            }
        };
    }
    getRateLimitStorage() {
        return {
            set: (perSecond, perTick) => {
                this.cached.rateLimit = { perSecond, perTick };
                this.storage.save(this.cached);
            }
        };
    }
    /**
     * 重置玩家数据（仅清开关偏好）
     */
    resetPlayerData(player) {
        try {
            player.setDynamicProperty('veinminer:personal_toggle', true);
        }
        catch (err) {
            Logger.error('重置玩家数据失败', err);
        }
    }
    /**
     * 重新加载
     */
    reload() {
        this.cached = this.storage.reload();
    }
}
