/**
 * ClientConfigRegistry.ts
 * 职责：客户端配置注册中心
 * 在客户端模式下，所有玩家拥有完整的个人配置能力
 * 客户端模式：白名单 = 共享默认 + 个人自定义
 *            最大连锁数 = min(个人设置, 共享默认)
 */
import { PersonalBlockListManager } from '../personal/blocklist/PersonalBlockListManager';
import { PersonalMaxVeinManager } from '../personal/maxvein/PersonalMaxVeinManager';
import { PersonalToggleManager } from '../personal/toggle/PersonalToggleManager';
import { PersonalSpecialOverrideManager } from '../personal/specialoverride/PersonalSpecialOverrideManager';
export class ClientConfigRegistry {
    blockList = new PersonalBlockListManager();
    maxVein = new PersonalMaxVeinManager();
    toggle = new PersonalToggleManager();
    specialOverride = new PersonalSpecialOverrideManager();
    /**
     * 获取玩家有效白名单（共享默认 + 个人自定义）
     */
    getEffectiveWhitelist(player) {
        return this.blockList.getEffective(player);
    }
    /**
     * 获取有效最大连锁数
     */
    getEffectiveMaxVein(player) {
        return this.maxVein.getEffective(player);
    }
    /**
     * 获取个人开关
     */
    getPersonalToggle(player) {
        return this.toggle.get(player);
    }
    /**
     * 设置个人开关
     */
    setPersonalToggle(player, value) {
        this.toggle.set(player, value);
    }
    /**
     * 获取各管理器（供 UI 调用）
     */
    getBlockListManager() {
        return this.blockList;
    }
    getMaxVeinManager() {
        return this.maxVein;
    }
    getToggleManager() {
        return this.toggle;
    }
    getSpecialOverrideManager() {
        return this.specialOverride;
    }
    /**
     * 重置玩家所有数据
     */
    resetPlayerData(player) {
        this.blockList.reset(player);
        this.maxVein.reset(player);
        this.toggle.reset(player);
        this.specialOverride.reset(player);
    }
    /**
     * 客户端模式无黑名单
     */
    isBlacklisted(_blockId) {
        return false;
    }
    /**
     * 客户端模式无维度限制（全部启用）
     */
    getDimensionConfig(_dimensionId) {
        return { enabled: true, multiplier: 1.0 };
    }
}
