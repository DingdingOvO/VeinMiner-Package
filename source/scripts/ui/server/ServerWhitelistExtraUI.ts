/**
 * ServerWhitelistExtraUI.ts
 * 职责：额外白名单查看 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';

export class ServerWhitelistExtraUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const list = registry.getServerWhitelistExtraStorage().list();

            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.server.whitelistExtra'));
            form.body(list.length > 0
                ? `§7额外白名单 (${list.length}):§r\n${list.map(b => `§8- ${b}`).join('\n')}`
                : '§7额外白名单为空§r'
            );

            form.button(I18n.for(player, 'veinminer.ui.back'));

            const response = await form.show(player);
            if (response.canceled) return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        } catch (err) {
            Logger.error('ServerWhitelistExtraUI 显示失败', err);
        }
    }
}
