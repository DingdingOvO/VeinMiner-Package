/**
 * ServerAdminMainUI.ts ★ 服务端管理主菜单 ★
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
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
            form.title('veinminer.ui.adminPanel');
            form.body({ rawtext: [{ text: '§7' }, { translate: 'veinminer.cmd.serverMode' }, { text: '§r' }] });

            form.button('veinminer.ui.server.limits');
            form.button('veinminer.ui.server.blacklist');
            form.button('veinminer.ui.server.whitelistExtra');
            form.button('veinminer.ui.server.dimension');
            form.button('veinminer.ui.server.rateLimit');
            form.button('veinminer.ui.server.playerOverride');
            form.button('veinminer.ui.server.cooldown');
            form.button('veinminer.ui.back');

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