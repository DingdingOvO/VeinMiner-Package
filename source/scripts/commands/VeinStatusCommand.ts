/**
 * VeinStatusCommand.ts
 * 职责：/vein status - 查看当前状态
 */

import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
import { EnvironmentDetector } from '../utils/EnvironmentDetector';

export class VeinStatusCommand extends CommandBase {
    public readonly meta: CommandMeta = {
        name: 'status',
        description: '查看当前状态',
        usage: '/vein status',
        opOnly: false,
        env: 'all'
    };

    public execute(ctx: CommandContext): boolean {
        const registry = ConfigRegistry.getInstance();
        const env = EnvironmentDetector.detect();
        const envKey = env === 'server' ? 'veinminer.msg.envServer' : 'veinminer.msg.envClient';
        const toggle = registry.getPersonalToggle(ctx.player);
        const maxVein = registry.getEffectiveMaxVein(ctx.player);
        const statusKey = toggle ? 'veinminer.ui.on' : 'veinminer.ui.off';
        const statusColor = toggle ? '§a' : '§c';

        ctx.player.sendMessage({
            rawtext: [
                { text: '§e§l' }, { translate: 'veinminer.ui.title' }, { text: '§r\n' },
                { translate: envKey }, { text: '\n' },
                { text: '§7' }, { translate: 'veinminer.ui.toggle' }, { text: ': ' },
                { text: statusColor }, { translate: statusKey }, { text: '§r\n' },
                { text: '§7' }, { translate: 'veinminer.ui.maxBlocks' }, { text: ': §e' },
                { text: String(maxVein) }, { text: '§r' }
            ]
        });
        return true;
    }
}