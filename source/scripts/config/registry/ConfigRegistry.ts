/**
 * ConfigRegistry.ts ★ 核心：统一配置注册中心 ★
 * 职责：根据环境自动适配，对外暴露统一的配置访问接口
 *
 * 设计：
 * - 启动时根据 EnvironmentDetector 决定使用 ClientConfigRegistry 或 ServerConfigRegistry
 * - 业务层无需感知环境差异，统一通过本类访问
 * - 暴露 getServerXxxStorage 系列方法（仅服务端模式有效）
 */

import { Player } from '@minecraft/server';
import { EnvironmentDetector } from '../../utils/EnvironmentDetector';
import { ClientConfigRegistry } from '../client/registry/ClientConfigRegistry';
import { ServerConfigRegistry, DimensionView } from '../server/registry/ServerConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ConfigRegistry {
    private static instance: ConfigRegistry;

    private env = EnvironmentDetector.detect();
    private clientRegistry = new ClientConfigRegistry();
    private serverRegistry = new ServerConfigRegistry();

    private constructor() {
        Logger.info(`ConfigRegistry 初始化完成 (环境: ${this.env})`);
    }

    public static getInstance(): ConfigRegistry {
        if (!ConfigRegistry.instance) {
            ConfigRegistry.instance = new ConfigRegistry();
        }
        return ConfigRegistry.instance;
    }

    /** 获取当前环境 */
    public getEnvironment() {
        return this.env;
    }

    /** 是否服务端模式 */
    public isServerMode(): boolean {
        return this.env === 'server';
    }

    /** 是否客户端模式 */
    public isClientMode(): boolean {
        return this.env === 'client';
    }

    /**
     * 获取有效白名单（环境适配）
     */
    public getEffectiveWhitelist(player: Player): string[] {
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
    public getEffectiveMaxVein(player: Player, blockId?: string, dimensionId?: string): number {
        if (this.isServerMode()) {
            return this.serverRegistry.getEffectiveMaxVein(player, blockId, dimensionId);
        }
        return this.clientRegistry.getEffectiveMaxVein(player);
    }

    /**
     * 是否黑名单（客户端模式始终返回 false）
     */
    public isBlacklisted(blockId: string): boolean {
        if (this.isServerMode()) {
            return this.serverRegistry.isBlacklisted(blockId);
        }
        return false;
    }

    /**
     * 获取维度配置
     */
    public getDimensionConfig(dimensionId: string): DimensionView {
        if (this.isServerMode()) {
            return this.serverRegistry.getDimensionConfig(dimensionId);
        }
        return { enabled: true, multiplier: 1.0 };
    }

    /**
     * 获取/设置个人开关
     */
    public getPersonalToggle(player: Player): boolean {
        if (this.isServerMode()) {
            return this.serverRegistry.getPersonalToggle(player);
        }
        return this.clientRegistry.getPersonalToggle(player);
    }

    public setPersonalToggle(player: Player, value: boolean): void {
        if (this.isServerMode()) {
            this.serverRegistry.setPersonalToggle(player, value);
        } else {
            this.clientRegistry.setPersonalToggle(player, value);
        }
    }

    /**
     * 重置玩家数据
     */
    public resetPlayerData(player: Player): void {
        if (this.isServerMode()) {
            this.serverRegistry.resetPlayerData(player);
        } else {
            this.clientRegistry.resetPlayerData(player);
        }
    }

    // ===== 服务端存储接口（仅服务端模式有效，客户端模式返回 stub） =====

    public getServerBlacklistStorage() {
        return this.serverRegistry.getBlacklistStorage();
    }

    public getServerWhitelistExtraStorage() {
        return this.serverRegistry.getWhitelistExtraStorage();
    }

    public getServerBlockLimitsStorage() {
        return this.serverRegistry.getBlockLimitsStorage();
    }

    public getServerRateLimitStorage() {
        return this.serverRegistry.getRateLimitStorage();
    }

    /**
     * 重新加载配置
     */
    public reload(): void {
        if (this.isServerMode()) {
            this.serverRegistry.reload();
        }
        // 客户端模式无缓存，无需 reload
        Logger.info('配置已重新加载');
    }

    /**
     * 获取客户端注册中心（仅客户端模式有效）
     */
    public getClientRegistry(): ClientConfigRegistry {
        return this.clientRegistry;
    }

    /**
     * 获取服务端注册中心
     */
    public getServerRegistry(): ServerConfigRegistry {
        return this.serverRegistry;
    }
}
