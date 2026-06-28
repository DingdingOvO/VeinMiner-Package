/**
 * ServerCooldownUI.ts
 * 职责：冷却设置查看 UI
 */

import { Player } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';

export class ServerCooldownUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const cooldown = registry.getServerRegistry().getCooldown();

            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.server.cooldown'));
            form.body(
                `§7个人冷却: §e${cooldown.personalSec}§r 秒\n` +
                `§7全服冷却: §e${cooldown.globalSec}§r 秒\n\n` +
                `§7通过修改配置文件调整§r`
            );

            form.button(I18n.for(player, 'veinminer.ui.back'));

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
