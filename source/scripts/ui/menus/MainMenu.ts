/**
 * MainMenu.ts ★ 核心UI：主菜单 ★
 * 职责：根据运行环境显示不同菜单
 * - 客户端模式：完整个人设置（开关/上限/白名单）
 * - 服务端模式（普通玩家）：仅显示状态 + 开关（若允许）
 * - 服务端模式（OP）：额外显示管理入口
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
import { AdvancedSettingsModal } from './AdvancedSettingsModal';
import { WhitelistManagerUI } from '../personal/WhitelistManagerUI';
import { ServerAdminMainUI } from '../server/ServerAdminMainUI';

export class MainMenu {
    /**
     * 显示主菜单
     */
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const isServer = registry.isServerMode();
            const isOp = this.isOp(player);

            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.title'));

            // 显示环境信息
            const envName = isServer
                ? I18n.for(player, 'veinminer.cmd.serverMode')
                : I18n.for(player, 'veinminer.cmd.clientMode');
            form.body(`${I18n.for(player, 'veinminer.msg.envDetected', envName)}\n${I18n.for(player, 'veinminer.ui.status')}: ${this.getStatusText(player)}`);

            // 客户端模式 - 完整个人菜单
            if (!isServer) {
                form.button(I18n.for(player, 'veinminer.ui.toggle'));
                form.button(I18n.for(player, 'veinminer.ui.maxBlocks'));
                form.button(I18n.for(player, 'veinminer.ui.whitelist'));
                form.button(I18n.for(player, 'veinminer.ui.reset'));
            } else {
                // 服务端模式 - 普通玩家仅显示开关（若允许）
                const allowToggle = registry.getServerRegistry()['cached'].playerOverride.allowToggle;
                if (allowToggle || isOp) {
                    form.button(I18n.for(player, 'veinminer.ui.toggle'));
                }
                // OP 显示管理面板入口
                if (isOp) {
                    form.button(I18n.for(player, 'veinminer.ui.adminPanel'));
                }
            }

            const response = await form.show(player);
            if (response.canceled) return;

            await this.handleResponse(player, response.selection ?? 0, isServer, isOp);
        } catch (err) {
            Logger.error('MainMenu 显示失败', err);
        }
    }

    /**
     * 处理菜单选择
     */
    private static async handleResponse(player: Player, selection: number, isServer: boolean, isOp: boolean): Promise<void> {
        const registry = ConfigRegistry.getInstance();

        // 客户端模式
        if (!isServer) {
            switch (selection) {
                case 0: { // toggle
                    const next = !registry.getPersonalToggle(player);
                    registry.setPersonalToggle(player, next);
                    player.sendMessage(I18n.for(player, next ? 'veinminer.msg.enabled' : 'veinminer.msg.disabled'));
                    break;
                }
                case 1: { // maxBlocks
                    await AdvancedSettingsModal.show(player);
                    break;
                }
                case 2: { // whitelist
                    await WhitelistManagerUI.show(player);
                    break;
                }
                case 3: { // reset
                    registry.resetPlayerData(player);
                    player.sendMessage(I18n.for(player, 'veinminer.msg.resetDone'));
                    break;
                }
            }
            return;
        }

        // 服务端模式
        const allowToggle = registry.getServerRegistry()['cached'].playerOverride.allowToggle;
        let buttonIdx = 0;
        if (allowToggle || isOp) {
            if (selection === buttonIdx) {
                const next = !registry.getPersonalToggle(player);
                registry.setPersonalToggle(player, next);
                player.sendMessage(I18n.for(player, next ? 'veinminer.msg.enabled' : 'veinminer.msg.disabled'));
                return;
            }
            buttonIdx++;
        }
        if (isOp) {
            if (selection === buttonIdx) {
                await ServerAdminMainUI.show(player);
            }
        }
    }

    /**
     * 获取状态文本
     */
    private static getStatusText(player: Player): string {
        const registry = ConfigRegistry.getInstance();
        const toggle = registry.getPersonalToggle(player);
        return toggle
            ? `§a${I18n.for(player, 'veinminer.ui.on')}§r`
            : `§c${I18n.for(player, 'veinminer.ui.off')}§r`;
    }

    /**
     * 判断 OP
     */
    private static isOp(player: Player): boolean {
        try {
            return (player as unknown as { isOp?: () => boolean }).isOp?.() ?? true;
        } catch {
            return true;
        }
    }
}
