/**
 * VeinCommand.ts
 * 职责：/vein 主命令（无参数时打开主菜单）
 */

import { CommandBase, CommandContext, CommandMeta } from './CommandBase';

export class VeinCommand extends CommandBase {
    public readonly meta: CommandMeta = {
        name: 'vein',
        description: '打开 VeinMiner 主菜单',
        usage: '/vein',
        opOnly: false,
        env: 'all'
    };

    public execute(ctx: CommandContext): boolean {
        ctx.player.sendMessage({ translate: 'veinminer.cmd.help' });
        return true;
    }
}