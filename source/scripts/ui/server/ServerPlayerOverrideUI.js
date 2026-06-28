/**
 * ServerPlayerOverrideUI.ts
 * 职责：玩家权限覆盖查看 UI
 */
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
export class ServerPlayerOverrideUI {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const cached = registry.getServerRegistry().cached;
            const o = cached.playerOverride;
            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.server.playerOverride'));
            form.body(`§7允许玩家切换开关: ${o.allowToggle ? '§a是' : '§c否'}§r\n` +
                `§7允许玩家调整最大连锁数: ${o.allowMaxVein ? '§a是' : '§c否'}§r\n` +
                `§7允许玩家管理个人白名单: ${o.allowWhitelist ? '§a是' : '§c否'}§r\n\n` +
                `§7通过修改配置文件调整§r`);
            form.button(I18n.for(player, 'veinminer.ui.back'));
            const response = await form.show(player);
            if (response.canceled)
                return;
            if (response.selection === 0) {
                import('./ServerAdminMainUI').then(m => m.ServerAdminMainUI.show(player));
            }
        }
        catch (err) {
            Logger.error('ServerPlayerOverrideUI 显示失败', err);
        }
    }
}
