/**
 * AddCurrentBlockUI.ts
 * 职责：添加玩家正在瞄准的方块到白名单
 */

import { Player } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Lang } from '../../utils/Lang';
import { Logger } from '../../utils/Logger';

export class AddCurrentBlockUI {
    /**
     * 添加玩家准星所指方块到白名单
     */
    public static async addFromView(player: Player): Promise<void> {
        try {
            const blockRay = player.getBlockFromViewDirection({ maxDistance: 8 });
            if (!blockRay) {
                Lang.msg(player, 'veinminer.cmd.invalidBlock');
                return;
            }
            const block = blockRay.block;
            const registry = ConfigRegistry.getInstance();
            const manager = registry.getClientRegistry().getBlockListManager();
            const success = manager.add(player, block.typeId);
            if (success) {
                Lang.msgF(player, 'veinminer.msg.blockAdded', block.typeId);
            } else {
                Lang.msg(player, 'veinminer.msg.alreadyInList');
            }
        } catch (err) {
            Logger.error('AddCurrentBlockUI 失败', err);
        }
    }
}