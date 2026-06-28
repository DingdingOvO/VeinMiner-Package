/**
 * ServerRateLimitUI.ts
 * 职责：速率限制查看 UI
 */
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
export class ServerRateLimitUI {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const limit = registry.getServerRegistry().getRateLimit();
            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.server.rateLimit'));
            form.body(`§7每秒上限: §e${limit.perSecond}§r\n` +
                `§7每 tick 上限: §e${limit.perTick}§r\n\n` +
                `§7使用 /vein rate <每秒> <每tick> 修改§r`);
            form.button(I18n.for(player, 'veinminer.ui.back'));
            const response = await form.show(player);
            if (response.canceled)
                return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        }
        catch (err) {
            Logger.error('ServerRateLimitUI 显示失败', err);
        }
    }
}
