/**
 * ServerLimitsUI.ts
 * 职责：方块上限管理 UI
 */
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
export class ServerLimitsUI {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const limits = registry.getServerBlockLimitsStorage().list();
            const entries = Object.entries(limits);
            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.server.limits'));
            form.body(entries.length > 0
                ? `§7当前自定义上限:§r\n${entries.map(([k, v]) => `§8- ${k}: §e${v}`).join('\n')}`
                : '§7使用 /vein limit <方块ID> <数量> 设置§r');
            form.button(I18n.for(player, 'veinminer.ui.back'));
            const response = await form.show(player);
            if (response.canceled)
                return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        }
        catch (err) {
            Logger.error('ServerLimitsUI 显示失败', err);
        }
    }
}
