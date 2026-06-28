/**
 * VeinStatusCommand.ts
 * 职责：/vein status - 查看当前状态
 */

import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
import { EnvironmentDetector } from '../utils/EnvironmentDetector';
import { I18n } from '../utils/I18n';

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
        const envName = env === 'server'
            ? I18n.for(ctx.player, 'veinminer.cmd.serverMode')
            : I18n.for(ctx.player, 'veinminer.cmd.clientMode');

        const toggle = registry.getPersonalToggle(ctx.player);
        const maxVein = registry.getEffectiveMaxVein(ctx.player);

        const lines: string[] = [
            `§e§l${I18n.for(ctx.player, 'veinminer.ui.title')}§r`,
            `§7${I18n.for(ctx.player, 'veinminer.msg.envDetected', envName)}`,
            `§7${I18n.for(ctx.player, 'veinminer.ui.toggle')}: ${toggle ? '§a' + I18n.for(ctx.player, 'veinminer.ui.on') : '§c' + I18n.for(ctx.player, 'veinminer.ui.off')}§r`,
            `§7${I18n.for(ctx.player, 'veinminer.ui.maxBlocks')}: §e${maxVein}§r`
        ];
        ctx.player.sendMessage(lines.join('\n'));
        return true;
    }
}
