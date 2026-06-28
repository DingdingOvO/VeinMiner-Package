/**
 * ServerPlayerOverrideUI.ts
 * 职责：玩家权限覆盖查看 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ServerPlayerOverrideUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const cached = (registry.getServerRegistry() as unknown as { cached: { playerOverride: { allowToggle: boolean; allowMaxVein: boolean; allowWhitelist: boolean } } }).cached;
            const o = cached.playerOverride;

            const form = new ActionFormData();
            form.title('veinminer.ui.server.playerOverride');
            form.body({
                rawtext: [
                    { text: '§7' }, { translate: 'veinminer.ui.server.allowToggle' },
                    { text: ': ' }, { translate: o.allowToggle ? 'veinminer.ui.yes' : 'veinminer.ui.no' },
                    { text: '§r\n' },

                    { text: '§7' }, { translate: 'veinminer.ui.server.allowMaxVein' },
                    { text: ': ' }, { translate: o.allowMaxVein ? 'veinminer.ui.yes' : 'veinminer.ui.no' },
                    { text: '§r\n' },

                    { text: '§7' }, { translate: 'veinminer.ui.server.allowWhitelist' },
                    { text: ': ' }, { translate: o.allowWhitelist ? 'veinminer.ui.yes' : 'veinminer.ui.no' },
                    { text: '§r\n\n' },

                    { text: '§7' }, { translate: 'veinminer.ui.server.editViaConfig' }, { text: '§r' }
                ]
            });

            form.button('veinminer.ui.back');

            const response = await form.show(player);
            if (response.canceled) return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        } catch (err) {
            Logger.error('ServerPlayerOverrideUI 显示失败', err);
        }
    }
}