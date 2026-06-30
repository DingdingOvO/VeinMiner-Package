/**
 * ServerDimensionUI.ts
 * 职责：维度设置 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';

export class ServerDimensionUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const serverReg = registry.getServerRegistry();
            const cached = (serverReg as unknown as { cached: { dimensions: Record<string, { enabled: boolean; multiplier: number }> } }).cached;
            const d = cached.dimensions;

            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.server.dimension'));
            form.body(
                `§7${I18n.for(player, 'veinminer.status.overworld')}: ${d.overworld.enabled ? '§a' + I18n.for(player, 'veinminer.ui.on') : '§c' + I18n.for(player, 'veinminer.ui.off')}§r (×${d.overworld.multiplier})\n` +
                `§7${I18n.for(player, 'veinminer.status.nether')}: ${d.nether.enabled ? '§a' + I18n.for(player, 'veinminer.ui.on') : '§c' + I18n.for(player, 'veinminer.ui.off')}§r (×${d.nether.multiplier})\n` +
                `§7${I18n.for(player, 'veinminer.status.end')}: ${d.end.enabled ? '§a' + I18n.for(player, 'veinminer.ui.on') : '§c' + I18n.for(player, 'veinminer.ui.off')}§r (×${d.end.multiplier})\n\n` +
                `§7使用配置文件或命令修改具体数值§r`
            );

            form.button(I18n.for(player, 'veinminer.ui.back'));

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
