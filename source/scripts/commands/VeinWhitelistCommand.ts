/**
 * VeinWhitelistCommand.ts
 * 职责：/vein whitelist <add|remove|list> [方块ID] - 管理额外白名单
 * 仅服务端模式 + OP 可用
 */

import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
import { BlockIdHelper } from '../lib/utils/BlockIdHelper';

export class VeinWhitelistCommand extends CommandBase {
    public readonly meta: CommandMeta = {
        name: 'whitelist',
        description: '管理额外白名单',
        usage: '/vein whitelist <add|remove|list> [方块ID]',
        opOnly: true,
        env: 'server'
    };

    public execute(ctx: CommandContext): boolean {
        const action = this.arg(ctx, 0);
        if (!action || !['add', 'remove', 'list'].includes(action)) {
            ctx.player.sendMessage(this.meta.usage);
            return false;
        }

        const registry = ConfigRegistry.getInstance();
        const storage = registry.getServerWhitelistExtraStorage();

        if (action === 'list') {
            const list = storage.list();
            if (list.length === 0) {
                ctx.player.sendMessage('§7额外白名单为空');
            } else {
                ctx.player.sendMessage(`§e额外白名单 (${list.length}):§r\n${list.map(b => `§7- ${b}`).join('\n')}`);
            }
            return true;
        }

        const blockId = this.arg(ctx, 1);
        if (!blockId) {
            ctx.player.sendMessage('§c' + this.meta.usage);
            return false;
        }

        const normalized = BlockIdHelper.normalize(blockId);
        if (action === 'add') {
            if (storage.has(normalized)) {
                this.feedback(ctx, 'veinminer.msg.alreadyInList');
                return false;
            }
            storage.add(normalized);
            this.feedback(ctx, 'veinminer.cmd.whitelistAdd', normalized);
            return true;
        } else {
            if (!storage.has(normalized)) {
                this.feedback(ctx, 'veinminer.msg.notInList');
                return false;
            }
            storage.remove(normalized);
            this.feedback(ctx, 'veinminer.cmd.whitelistRemove', normalized);
            return true;
        }
    }
}
