/**
 * VeinRateCommand.ts
 * 职责：/vein rate <每秒> <每tick> - 设置全服速率限制
 * 仅服务端模式 + OP 可用
 */

import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';

export class VeinRateCommand extends CommandBase {
    public readonly meta: CommandMeta = {
        name: 'rate',
        description: '设置全服速率限制',
        usage: '/vein rate <每秒数量> <每tick数量>',
        opOnly: true,
        env: 'server'
    };

    public execute(ctx: CommandContext): boolean {
        const perSecond = this.parseInt(ctx, 0);
        const perTick = this.parseInt(ctx, 1);
        if (perSecond === null || perTick === null) {
            ctx.player.sendMessage({ text: '§c' + this.meta.usage });
            return false;
        }

        if (perSecond < 1 || perTick < 1) {
            ctx.player.sendMessage({ translate: 'veinminer.cmd.positiveNumber' });
            return false;
        }

        if (perTick > perSecond) {
            ctx.player.sendMessage({ translate: 'veinminer.cmd.rateOverflow' });
            return false;
        }

        const registry = ConfigRegistry.getInstance();
        registry.getServerRateLimitStorage().set(perSecond, perTick);
        this.feedbackF(ctx, 'veinminer.cmd.rateSet', perSecond, perTick);
        return true;
    }
}