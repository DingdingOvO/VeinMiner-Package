/**
 * MainMenu.ts - VeinMiner 主菜单
 *
 * 表单文本直接传翻译 key，游戏引擎自动根据玩家语言选择对应 .lang 文件。
 * sendMessage / setActionBar 使用 rawtext translate/with。
 * - 客户端模式：完整个人设置（开关/上限/掉落物/白名单/重置）
 * - 服务端模式（普通玩家）：仅显示状态 + 开关（若允许）
 * - 服务端模式（OP）：额外显示管理入口
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Lang } from '../../utils/Lang';
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

            const envKey = isServer ? 'veinminer.msg.envServer' : 'veinminer.msg.envClient';
            const toggle = registry.getPersonalToggle(player);
            const statusKey = toggle ? 'veinminer.ui.enabled' : 'veinminer.ui.disabled';
            const statusColor = toggle ? '§a' : '§c';

            const form = new ActionFormData();
            form.title('veinminer.ui.title');
            form.body({
                rawtext: [
                    { translate: envKey },
                    { text: '\n' },
                    { translate: 'veinminer.ui.status' },
                    { text: ': ' },
                    { text: statusColor },
                    { translate: statusKey },
                    { text: '§r' }
                ]
            });

            if (!isServer) {
                // 客户端模式 - 完整个人菜单
                form.button('veinminer.ui.toggle');
                form.button('veinminer.ui.maxBlocks');
                form.button('veinminer.ui.collectDrops');
                form.button('veinminer.ui.whitelist');
                form.button('veinminer.ui.reset');
            } else {
                // 服务端模式
                const override = registry.getServerRegistry().getPlayerOverride();
                if (override.allowToggle || isOp) {
                    form.button('veinminer.ui.toggle');
                }
                if (isOp) {
                    form.button('veinminer.ui.adminPanel');
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
                case 0: { // 连锁开关
                    const next = !registry.getPersonalToggle(player);
                    registry.setPersonalToggle(player, next);
                    Lang.msg(player, next ? 'veinminer.msg.enabled' : 'veinminer.msg.disabled');
                    break;
                }
                case 1: { // 最大连锁数
                    await AdvancedSettingsModal.show(player);
                    break;
                }
                case 2: { // 掉落物集中
                    await this.toggleCollectDrops(player);
                    break;
                }
                case 3: { // 白名单管理
                    await WhitelistManagerUI.show(player);
                    break;
                }
                case 4: { // 重置设置
                    registry.resetPlayerData(player);
                    player.setDynamicProperty('veinminer:collect_drops', true);
                    Lang.msg(player, 'veinminer.msg.resetDone');
                    break;
                }
            }
            return;
        }

        // 服务端模式
        const override = registry.getServerRegistry().getPlayerOverride();
        let buttonIdx = 0;
        if (override.allowToggle || isOp) {
            if (selection === buttonIdx) {
                const next = !registry.getPersonalToggle(player);
                registry.setPersonalToggle(player, next);
                Lang.msg(player, next ? 'veinminer.msg.enabled' : 'veinminer.msg.disabled');
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
     * 掉落物集中开关
     */
    private static async toggleCollectDrops(player: Player): Promise<void> {
        try {
            const current = player.getDynamicProperty('veinminer:collect_drops');
            const isOn = current !== false;
            const next = !isOn;
            player.setDynamicProperty('veinminer:collect_drops', next);
            Lang.msg(player, next ? 'veinminer.msg.collectDropsOn' : 'veinminer.msg.collectDropsOff');
        } catch (err) {
            Logger.error('切换掉落物集中失败', err);
        }
    }

    /**
     * 判断 OP（非公开 API，安全优先返回 false）
     */
    private static isOp(player: Player): boolean {
        try {
            return (player as unknown as { isOp?: () => boolean }).isOp?.() ?? false;
        } catch {
            return false;
        }
    }
}