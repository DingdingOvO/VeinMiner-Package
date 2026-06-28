/**
 * VeinLimitCommand.ts
 * 职责：/vein limit <方块ID> <数量> | default <数量> | list
 * 仅服务端模式 + OP 可用
 */

import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
import { BlockIdHelper } from '../lib/utils/BlockIdHelper';

export class VeinLimitCommand extends CommandBase {
    public readonly meta: CommandMeta = {
        name: 'limit',
        description: '设置方块连锁上限',
        usage: '/vein limit <方块ID> <数量> | default <数量> | list',
        opOnly: true,
        env: 'server'
    };

    public execute(ctx: CommandContext): boolean {
        const action = this.arg(ctx, 0);
        const registry = ConfigRegistry.getInstance();
        const storage = registry.getServerBlockLimitsStorage();

        if (action === 'list') {
            const all = storage.list();
            const entries = Object.entries(all);
            if (entries.length === 0) {
                ctx.player.sendMessage({ translate: 'veinminer.cmd.noCustomLimit' });
            } else {
                ctx.player.sendMessage({
                    rawtext: [
                        { text: '§e' }, { translate: 'veinminer.cmd.limitList' }, { text: ':§r\n' },
                        { text: entries.map(([k, v]) => `§7- ${k}: §e${v}`).join('\n') }
                    ]
                });
            }
            return true;
        }

        if (action === 'default') {
            const num = this.parseInt(ctx, 1);
            if (num === null) return false;
            storage.setDefault(num);
            this.feedbackF(ctx, 'veinminer.cmd.limitDefault', num);
            return true;
        }

        // 普通设置：/vein limit <方块ID> <数量>
        const blockId = BlockIdHelper.normalize(action ?? '');
        const num = this.parseInt(ctx, 1);
        if (!blockId || num === null) {
            ctx.player.sendMessage({ text: '§c' + this.meta.usage });
            return false;
        }

        storage.set(blockId, num);
        this.feedbackF(ctx, 'veinminer.cmd.limitSet', blockId, num);
        return true;
    }
}