/**
 * ServerRateLimitUI.ts
 * 职责：速率限制查看 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ServerRateLimitUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const limit = registry.getServerRegistry().getRateLimit();

            const form = new ActionFormData();
            form.title('veinminer.ui.server.rateLimit');
            form.body({
                rawtext: [
                    { text: '§7' }, { translate: 'veinminer.ui.server.perSecond' },
                    { text: ': §e' }, { text: String(limit.perSecond) }, { text: '§r\n' },

                    { text: '§7' }, { translate: 'veinminer.ui.server.perTick' },
                    { text: ': §e' }, { text: String(limit.perTick) }, { text: '§r\n\n' },

                    { text: '§7' }, { translate: 'veinminer.ui.server.howToSetRate' }, { text: '§r' }
                ]
            });

            form.button('veinminer.ui.back');

            const response = await form.show(player);
            if (response.canceled) return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        } catch (err) {
            Logger.error('ServerRateLimitUI 显示失败', err);
        }
    }
}