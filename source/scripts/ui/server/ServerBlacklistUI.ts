/**
 * ServerBlacklistUI.ts
 * 职责：黑名单管理 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ServerBlacklistUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const list = registry.getServerBlacklistStorage().list();

            const form = new ActionFormData();
            form.title('veinminer.ui.server.blacklist');

            if (list.length > 0) {
                form.body({
                    rawtext: [
                        { text: '§7' },
                        { translate: 'veinminer.ui.server.blacklist' },
                        { text: ` (${list.length}):§r\n` },
                        { text: list.map(b => `§8- ${b}`).join('\n') }
                    ]
                });
            } else {
                form.body({ translate: 'veinminer.cmd.blacklistEmpty' });
            }

            form.button('veinminer.ui.back');

            const response = await form.show(player);
            if (response.canceled) return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        } catch (err) {
            Logger.error('ServerBlacklistUI 显示失败', err);
        }
    }
}