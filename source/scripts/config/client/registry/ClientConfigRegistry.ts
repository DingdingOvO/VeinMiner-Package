/**
 * ClientConfigRegistry.ts
 * 职责：客户端配置注册中心
 * 在客户端模式下，所有玩家拥有完整的个人配置能力
 * 客户端模式：白名单 = 共享默认 + 个人自定义
 *            最大连锁数 = min(个人设置, 共享默认)
 */

import { Player } from '@minecraft/server';
import { PersonalBlockListManager } from '../personal/blocklist/PersonalBlockListManager';
import { PersonalMaxVeinManager } from '../personal/maxvein/PersonalMaxVeinManager';
import { PersonalToggleManager } from '../personal/toggle/PersonalToggleManager';
import { PersonalSpecialOverrideManager } from '../personal/specialoverride/PersonalSpecialOverrideManager';

export class ClientConfigRegistry {
    private blockList = new PersonalBlockListManager();
    private maxVein = new PersonalMaxVeinManager();
    private toggle = new PersonalToggleManager();
    private specialOverride = new PersonalSpecialOverrideManager();

    /**
     * 获取玩家有效白名单（共享默认 + 个人自定义）
     */
    public getEffectiveWhitelist(player: Player): string[] {
        return this.blockList.getEffective(player);
    }

    /**
     * 获取有效最大连锁数
     */
    public getEffectiveMaxVein(player: Player): number {
        return this.maxVein.getEffective(player);
    }

    /**
     * 获取个人开关
     */
    public getPersonalToggle(player: Player): boolean {
        return this.toggle.get(player);
    }

    /**
     * 设置个人开关
     */
    public setPersonalToggle(player: Player, value: boolean): void {
        this.toggle.set(player, value);
    }

    /**
     * 获取各管理器（供 UI 调用）
     */
    public getBlockListManager(): PersonalBlockListManager {
        return this.blockList;
    }

    public getMaxVeinManager(): PersonalMaxVeinManager {
        return this.maxVein;
    }

    public getToggleManager(): PersonalToggleManager {
        return this.toggle;
    }

    public getSpecialOverrideManager(): PersonalSpecialOverrideManager {
        return this.specialOverride;
    }

    /**
     * 重置玩家所有数据
     */
    public resetPlayerData(player: Player): void {
        this.blockList.reset(player);
        this.maxVein.reset(player);
        this.toggle.reset(player);
        this.specialOverride.reset(player);
    }

    /**
     * 客户端模式无黑名单
     */
    public isBlacklisted(_blockId: string): boolean {
        return false;
    }

    /**
     * 客户端模式无维度限制（全部启用）
     */
    public getDimensionConfig(_dimensionId: string): { enabled: boolean; multiplier: number } {
        return { enabled: true, multiplier: 1.0 };
    }
}
