/**
 * WhitelistManagerUI.ts
 * 职责：个人白名单管理 UI（仅客户端模式）
 */
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
export class WhitelistManagerUI {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const manager = registry.getClientRegistry().getBlockListManager();
            const personalList = manager.listPersonal(player);
            const form = new ActionFormData();
            form.title(I18n.for(player, 'veinminer.ui.whitelist'));
            form.body(personalList.length > 0
                ? `§7${I18n.for(player, 'veinminer.ui.current')} (${personalList.length}):§r\n${personalList.map(b => `§8- ${b}`).join('\n')}`
                : '§7' + I18n.for(player, 'veinminer.ui.default') + '§r');
            form.button(I18n.for(player, 'veinminer.ui.addBlock'));
            form.button(I18n.for(player, 'veinminer.ui.removeBlock'));
            form.button(I18n.for(player, 'veinminer.ui.back'));
            const response = await form.show(player);
            if (response.canceled)
                return;
            switch (response.selection) {
                case 0:
                    await this.addBlock(player);
                    break;
                case 1:
                    await this.removeBlock(player);
                    break;
                case 2:
                    // 返回主菜单
                    import('../menus/MainMenu').then(m => m.MainMenu.show(player));
                    break;
            }
        }
        catch (err) {
            Logger.error('WhitelistManagerUI 显示失败', err);
        }
    }
    /**
     * 添加方块（通过聊天输入）
     */
    static async addBlock(player) {
        // 简化：通过 /vein whitelist add 命令添加
        player.sendMessage('§e请使用 /vein whitelist add <方块ID> 添加方块§r');
    }
    /**
     * 移除方块
     */
    static async removeBlock(player) {
        player.sendMessage('§e请使用 /vein whitelist remove <方块ID> 移除方块§r');
    }
}
