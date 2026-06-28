/**
 * BreakHandler.ts
 * 职责：处理方块破坏的核心逻辑
 * 协调各子 handler 完成完整的连锁破坏流程
 */

import { Block, Player } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { WhitelistCheckHandler } from './WhitelistCheckHandler';
import { ToolCheckHandler } from './ToolCheckHandler';
import { SpecialRuleHandler } from './SpecialRuleHandler';
import { LimitCheckHandler } from './LimitCheckHandler';
import { DurabilityHandler } from './DurabilityHandler';
import { DropHandler } from './DropHandler';
import { Logger } from '../../utils/Logger';

export class BreakHandler {
    private whitelistCheck = new WhitelistCheckHandler();
    private toolCheck = new ToolCheckHandler();
    private specialRule = new SpecialRuleHandler();
    private limitCheck = new LimitCheckHandler();
    private durability = new DurabilityHandler();
    private drop = new DropHandler();

    /**
     * 处理单个方块的破坏
     * @returns 是否成功破坏
     */
    public handle(player: Player, block: Block, registry: ConfigRegistry): boolean {
        try {
            // 再次校验白名单（防止并发修改）
            if (!this.whitelistCheck.check(block, player, registry)) {
                return false;
            }

            // 工具检查
            if (!this.toolCheck.check(player)) {
                return false;
            }

            // 特殊规则检查
            if (!this.specialRule.check(block, player)) {
                return false;
            }

            // 上限检查
            if (!this.limitCheck.check(block, player, registry)) {
                return false;
            }

            // 耐久消耗
            if (!this.durability.consume(player, 1)) {
                return false;
            }

            // 掉落处理
            this.drop.handleDrop(player, block);

            // 破坏方块
            try {
                block.dimension.runCommand(`setblock ${Math.floor(block.location.x)} ${Math.floor(block.location.y)} ${Math.floor(block.location.z)} air destroy`);
            } catch (e) {
                // ignore
            }

            return true;
        } catch (err) {
            Logger.error('BreakHandler 处理失败', err);
            return false;
        }
    }
}
