/**
 * ServerDimensionUI.ts
 * 职责：维度设置 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Logger } from '../../utils/Logger';

export class ServerDimensionUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const serverReg = registry.getServerRegistry();
            const cached = (serverReg as unknown as { cached: { dimensions: Record<string, { enabled: boolean; multiplier: number }> } }).cached;
            const d = cached.dimensions;

            const form = new ActionFormData();
            form.title('veinminer.ui.server.dimension');
            form.body({
                rawtext: [
                    { text: '§7' }, { translate: 'veinminer.status.overworld' },
                    { text: ': ' }, { translate: d.overworld.enabled ? 'veinminer.ui.on' : 'veinminer.ui.off' },
                    { text: '§r' },
                    { text: ` (×${d.overworld.multiplier})\n` },

                    { text: '§7' }, { translate: 'veinminer.status.nether' },
                    { text: ': ' }, { translate: d.nether.enabled ? 'veinminer.ui.on' : 'veinminer.ui.off' },
                    { text: '§r' },
                    { text: ` (×${d.nether.multiplier})\n` },

                    { text: '§7' }, { translate: 'veinminer.status.end' },
                    { text: ': ' }, { translate: d.end.enabled ? 'veinminer.ui.on' : 'veinminer.ui.off' },
                    { text: '§r' },
                    { text: ` (×${d.end.multiplier})\n\n` },

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
            Logger.error('ServerDimensionUI 显示失败', err);
        }
    }
}