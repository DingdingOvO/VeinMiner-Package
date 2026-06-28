/**
 * EnvironmentDetector.ts ★ 核心：环境自动检测 ★
 * 职责：自动检测当前运行环境是专用服务器(BDS)还是客户端(单机/局域网)
 * 原理：尝试加载 @minecraft/server-admin 模块 - 仅 BDS 中可用
 *
 * 检测优先级：
 * 1. require('@minecraft/server-admin') 成功 → 服务端
 * 2. (system as any).server 存在 → 服务端（备选方案）
 * 3. 默认 → 客户端
 */
import { system } from '@minecraft/server';
import { Logger } from './Logger';
/** 运行环境枚举 */
export var Environment;
(function (Environment) {
    Environment["CLIENT"] = "client";
    Environment["SERVER"] = "server";
})(Environment || (Environment = {}));
/**
 * 环境检测器（单例缓存）
 */
export class EnvironmentDetector {
    /** 缓存检测结果 */
    static cached = null;
    /**
     * 检测当前运行环境
     * @returns 环境（CLIENT 或 SERVER）
     */
    static detect() {
        if (this.cached !== null) {
            return this.cached;
        }
        // 方法1：尝试加载 @minecraft/server-admin 模块
        // 该模块仅在专用服务器(BDS)中可用
        try {
            // @ts-ignore - 动态 require 在 TS 严格模式下需要忽略
            const admin = require('@minecraft/server-admin');
            if (admin) {
                this.cached = Environment.SERVER;
                Logger.info('环境检测: 服务端模式 (BDS) - 检测到 @minecraft/server-admin 模块');
                return this.cached;
            }
        }
        catch (e) {
            // 模块不存在 → 继续尝试其他方法
        }
        // 方法2：检测 system.server 属性（部分版本暴露）
        try {
            // @ts-ignore - system.server 非公开 API
            if (typeof system !== 'undefined' && system?.server) {
                this.cached = Environment.SERVER;
                Logger.info('环境检测: 服务端模式 (BDS) - 检测到 system.server 属性');
                return this.cached;
            }
        }
        catch {
            // 忽略
        }
        // 默认：客户端模式
        this.cached = Environment.CLIENT;
        Logger.info('环境检测: 客户端模式 (单机/局域网)');
        return this.cached;
    }
    /**
     * 是否服务端模式
     */
    static isServer() {
        return this.detect() === Environment.SERVER;
    }
    /**
     * 是否客户端模式
     */
    static isClient() {
        return this.detect() === Environment.CLIENT;
    }
    /**
     * 获取环境的本地化描述
     */
    static getLocalizedName() {
        return this.isServer() ? 'veinminer.cmd.serverMode' : 'veinminer.cmd.clientMode';
    }
    /**
     * 重置缓存（仅用于测试）
     */
    static _resetCache() {
        this.cached = null;
    }
}
