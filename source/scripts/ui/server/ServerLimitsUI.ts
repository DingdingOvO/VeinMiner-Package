/**
 * ServerLimitsUI.ts
 * 职责：方块上限管理 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ServerLimitsUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const limits = registry.getServerBlockLimitsStorage().list();
            const entries = Object.entries(limits);

            const form = new ActionFormData();
            form.title('veinminer.ui.server.limits');

            if (entries.length > 0) {
                form.body({
                    rawtext: [
                        { text: '§7' },
                        { translate: 'veinminer.ui.server.currentLimits' },
                        { text: ':§r\n' },
                        { text: entries.map(([k, v]) => `§8- ${k}: §e${v}`).join('\n') }
                    ]
                });
            } else {
                form.body({ translate: 'veinminer.ui.server.noCustomLimits' });
            }

            form.button('veinminer.ui.back');

            const response = await form.show(player);
            if (response.canceled) return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        } catch (err) {
            Logger.error('ServerLimitsUI 显示失败', err);
        }
    }
}