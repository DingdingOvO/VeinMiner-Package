/**
 * ConfigRegistry.ts ★ 核心：统一配置注册中心 ★
 * 职责：根据环境自动适配，对外暴露统一的配置访问接口
 *
 * 设计：
 * - 启动时根据 EnvironmentDetector 决定使用 ClientConfigRegistry 或 ServerConfigRegistry
 * - 业务层无需感知环境差异，统一通过本类访问
 * - 暴露 getServerXxxStorage 系列方法（仅服务端模式有效）
 */
import { EnvironmentDetector } from '../../utils/EnvironmentDetector';
import { ClientConfigRegistry } from '../client/registry/ClientConfigRegistry';
import { ServerConfigRegistry } from '../server/registry/ServerConfigRegistry';
import { Logger } from '../../utils/Logger';
export class ConfigRegistry {
    static instance;
    env = EnvironmentDetector.detect();
    clientRegistry = new ClientConfigRegistry();
    serverRegistry = new ServerConfigRegistry();
    constructor() {
        Logger.info(`ConfigRegistry 初始化完成 (环境: ${this.env})`);
    }
    static getInstance() {
        if (!ConfigRegistry.instance) {
            ConfigRegistry.instance = new ConfigRegistry();
        }
        return ConfigRegistry.instance;
    }
    /** 获取当前环境 */
    getEnvironment() {
        return this.env;
    }
    /** 是否服务端模式 */
    isServerMode() {
        return this.env === 'server';
    }
    /** 是否客户端模式 */
    isClientMode() {
        return this.env === 'client';
    }
    /**
     * 获取有效白名单（环境适配）
     */
    getEffectiveWhitelist(player) {
        if (this.isServerMode()) {
            return this.serverRegistry.getEffectiveWhitelist(player);
        }
        return this.clientRegistry.getEffectiveWhitelist(player);
    }
    /**
     * 获取有效最大连锁数
     * @param blockId 当前方块ID（服务端模式用于查方块特定上限）
     * @param dimensionId 当前维度（服务端模式用于倍率）
     */
    getEffectiveMaxVein(player, blockId, dimensionId) {
        if (this.isServerMode()) {
            return this.serverRegistry.getEffectiveMaxVein(player, blockId, dimensionId);
        }
        return this.clientRegistry.getEffectiveMaxVein(player);
    }
    /**
     * 是否黑名单（客户端模式始终返回 false）
     */
    isBlacklisted(blockId) {
        if (this.isServerMode()) {
            return this.serverRegistry.isBlacklisted(blockId);
        }
        return false;
    }
    /**
     * 获取维度配置
     */
    getDimensionConfig(dimensionId) {
        if (this.isServerMode()) {
            return this.serverRegistry.getDimensionConfig(dimensionId);
        }
        return { enabled: true, multiplier: 1.0 };
    }
    /**
     * 获取/设置个人开关
     */
    getPersonalToggle(player) {
        if (this.isServerMode()) {
            return this.serverRegistry.getPersonalToggle(player);
        }
        return this.clientRegistry.getPersonalToggle(player);
    }
    setPersonalToggle(player, value) {
        if (this.isServerMode()) {
            this.serverRegistry.setPersonalToggle(player, value);
        }
        else {
            this.clientRegistry.setPersonalToggle(player, value);
        }
    }
    /**
     * 重置玩家数据
     */
    resetPlayerData(player) {
        if (this.isServerMode()) {
            this.serverRegistry.resetPlayerData(player);
        }
        else {
            this.clientRegistry.resetPlayerData(player);
        }
    }
    // ===== 服务端存储接口（仅服务端模式有效，客户端模式返回 stub） =====
    getServerBlacklistStorage() {
        return this.serverRegistry.getBlacklistStorage();
    }
    getServerWhitelistExtraStorage() {
        return this.serverRegistry.getWhitelistExtraStorage();
    }
    getServerBlockLimitsStorage() {
        return this.serverRegistry.getBlockLimitsStorage();
    }
    getServerRateLimitStorage() {
        return this.serverRegistry.getRateLimitStorage();
    }
    /**
     * 重新加载配置
     */
    reload() {
        if (this.isServerMode()) {
            this.serverRegistry.reload();
        }
        // 客户端模式无缓存，无需 reload
        Logger.info('配置已重新加载');
    }
    /**
     * 获取客户端注册中心（仅客户端模式有效）
     */
    getClientRegistry() {
        return this.clientRegistry;
    }
    /**
     * 获取服务端注册中心
     */
    getServerRegistry() {
        return this.serverRegistry;
    }
}
