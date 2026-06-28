/**
 * WhitelistManagerUI.ts
 * 职责：个人白名单管理 UI（仅客户端模式）
 */

import { Player } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Lang } from '../../utils/Lang';
import { Logger } from '../../utils/Logger';

export class WhitelistManagerUI {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const manager = registry.getClientRegistry().getBlockListManager();
            const personalList = manager.listPersonal(player);

            const form = new ActionFormData();
            form.title('veinminer.ui.whitelist');

            if (personalList.length > 0) {
                form.body({
                    rawtext: [
                        { text: '§7' },
                        { translate: 'veinminer.ui.current' },
                        { text: ` (${personalList.length}):§r\n` },
                        { text: personalList.map(b => `§8- ${b}`).join('\n') }
                    ]
                });
            } else {
                form.body({ rawtext: [{ text: '§7' }, { translate: 'veinminer.ui.default' }, { text: '§r' }] });
            }

            form.button('veinminer.ui.addBlock');
            if (personalList.length > 0) {
                form.button('veinminer.ui.removeBlock');
            }
            form.button('veinminer.ui.back');

            const response = await form.show(player);
            if (response.canceled) return;

            if (response.selection === 0) {
                await this.addBlock(player, manager);
            } else if (response.selection === 1 && personalList.length > 0) {
                await this.removeBlock(player, manager, personalList);
            } else {
                import('../menus/MainMenu').then(m => m.MainMenu.show(player));
            }
        } catch (err) {
            Logger.error('WhitelistManagerUI 显示失败', err);
        }
    }

    /**
     * 添加方块（通过 ModalFormData 输入方块 ID）
     */
    private static async addBlock(player: Player, manager: { add: (p: Player, id: string) => boolean }): Promise<void> {
        try {
            const form = new ModalFormData();
            form.title('veinminer.ui.addBlock');
            form.textField('Block ID', 'minecraft:', { defaultValue: 'minecraft:' });

            const response = await form.show(player);
            if (response.canceled) return;

            const blockId = (response.formValues?.[0] as string ?? '').trim();
            if (!blockId) return;

            const ok = manager.add(player, blockId);
            if (ok) {
                Lang.msgF(player, 'veinminer.msg.blockAdded', blockId);
            } else {
                Lang.msg(player, 'veinminer.msg.alreadyInList');
            }
        } catch (err) {
            Logger.error('添加方块失败', err);
        }
    }

    /**
     * 移除方块
     */
    private static async removeBlock(player: Player, manager: { remove: (p: Player, id: string) => boolean }, list: string[]): Promise<void> {
        try {
            const form = new ActionFormData();
            form.title('veinminer.ui.removeBlock');
            for (const id of list) {
                form.button(`§8- ${id}`);
            }
            form.button('veinminer.ui.back');

            const response = await form.show(player);
            if (response.canceled) return;

            const idx = response.selection ?? 0;
            if (idx < list.length) {
                const blockId = list[idx];
                const ok = manager.remove(player, blockId);
                if (ok) {
                    Lang.msgF(player, 'veinminer.msg.blockRemoved', blockId);
                } else {
                    Lang.msg(player, 'veinminer.msg.notInList');
                }
            }
        } catch (err) {
            Logger.error('移除方块失败', err);
        }
    }
}