/**
 * ServerCooldownUI.ts
 * 职责：冷却设置查看 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ServerCooldownUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const cooldown = registry.getServerRegistry().getCooldown();

            const form = new ActionFormData();
            form.title('veinminer.ui.server.cooldown');
            form.body({
                rawtext: [
                    { text: '§7' }, { translate: 'veinminer.ui.server.personalCooldown' },
                    { text: ': §e' }, { text: String(cooldown.personalSec) }, { text: '§r ' },
                    { translate: 'veinminer.ui.seconds' },
                    { text: '\n' },

                    { text: '§7' }, { translate: 'veinminer.ui.server.globalCooldown' },
                    { text: ': §e' }, { text: String(cooldown.globalSec) }, { text: '§r ' },
                    { translate: 'veinminer.ui.seconds' },
                    { text: '\n\n' },

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
            Logger.error('ServerCooldownUI 显示失败', err);
        }
    }
}