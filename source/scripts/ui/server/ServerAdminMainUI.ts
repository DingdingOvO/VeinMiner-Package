/**
 * ServerAdminMainUI.ts ★ 服务端管理主菜单 ★
 * 职责：服务端模式 OP 专用管理面板
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
import { ServerLimitsUI } from './ServerLimitsUI';
import { ServerBlacklistUI } from './ServerBlacklistUI';
import { ServerWhitelistExtraUI } from './ServerWhitelistExtraUI';
import { ServerDimensionUI } from './ServerDimensionUI';
import { ServerRateLimitUI } from './ServerRateLimitUI';
import { ServerPlayerOverrideUI } from './ServerPlayerOverrideUI';
import { ServerCooldownUI } from './ServerCooldownUI';

export class ServerAdminMainUI {
    public static async show(player: Player): Promise<void> {
        try {
            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.adminPanel'));
            form.body('§7' + I18n.for(player, 'veinminer.cmd.serverMode') + '§r');

            form.button(I18n.for(player, 'veinminer.ui.server.limits'));
            form.button(I18n.for(player, 'veinminer.ui.server.blacklist'));
            form.button(I18n.for(player, 'veinminer.ui.server.whitelistExtra'));
            form.button(I18n.for(player, 'veinminer.ui.server.dimension'));
            form.button(I18n.for(player, 'veinminer.ui.server.rateLimit'));
            form.button(I18n.for(player, 'veinminer.ui.server.playerOverride'));
            form.button(I18n.for(player, 'veinminer.ui.server.cooldown'));
            form.button(I18n.for(player, 'veinminer.ui.back'));

            const response = await form.show(player);
            if (response.canceled) return;

            switch (response.selection) {
                case 0: await ServerLimitsUI.show(player); break;
                case 1: await ServerBlacklistUI.show(player); break;
                case 2: await ServerWhitelistExtraUI.show(player); break;
                case 3: await ServerDimensionUI.show(player); break;
                case 4: await ServerRateLimitUI.show(player); break;
                case 5: await ServerPlayerOverrideUI.show(player); break;
                case 6: await ServerCooldownUI.show(player); break;
                case 7: import('../menus/MainMenu').then(m => m.MainMenu.show(player)); break;
            }
        } catch (err) {
            Logger.error('ServerAdminMainUI 显示失败', err);
        }
    }
}
