/**
 * ServerWhitelistExtraUI.ts
 * 职责：额外白名单查看 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ServerWhitelistExtraUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const list = registry.getServerWhitelistExtraStorage().list();

            const form = new ActionFormData();
            form.title('veinminer.ui.server.whitelistExtra');

            if (list.length > 0) {
                form.body({
                    rawtext: [
                        { text: '§7' },
                        { translate: 'veinminer.ui.server.whitelistExtra' },
                        { text: ` (${list.length}):§r\n` },
                        { text: list.map(b => `§8- ${b}`).join('\n') }
                    ]
                });
            } else {
                form.body({ translate: 'veinminer.cmd.extraWhitelistEmpty' });
            }

            form.button('veinminer.ui.back');

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