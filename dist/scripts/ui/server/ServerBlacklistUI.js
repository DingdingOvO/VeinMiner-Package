/**
 * ServerBlacklistUI.ts
 * 职责：黑名单管理 UI（查看）
 */
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
export class ServerBlacklistUI {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const list = registry.getServerBlacklistStorage().list();
            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.server.blacklist'));
            form.body(list.length > 0
                ? `§7黑名单 (${list.length}):§r\n${list.map(b => `§8- ${b}`).join('\n')}`
                : '§7黑名单为空§r');
            form.button(I18n.for(player, 'veinminer.ui.back'));
            const response = await form.show(player);
            if (response.canceled)
                return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        }
        catch (err) {
            Logger.error('ServerBlacklistUI 显示失败', err);
        }
    }
}
