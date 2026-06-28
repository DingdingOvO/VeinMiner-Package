/**
 * VeinRateCommand.ts
 * 职责：/vein rate <每秒> <每tick> - 设置全服速率限制
 * 仅服务端模式 + OP 可用
 */
import { CommandBase } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
export class VeinRateCommand extends CommandBase {
    meta = {
        name: 'rate',
        description: '设置全服速率限制',
        usage: '/vein rate <每秒数量> <每tick数量>',
        opOnly: true,
        env: 'server'
    };
    execute(ctx) {
        const perSecond = this.parseInt(ctx, 0);
        const perTick = this.parseInt(ctx, 1);
        if (perSecond === null || perTick === null) {
            ctx.player.sendMessage('§c' + this.meta.usage);
            return false;
        }
        if (perSecond < 1 || perTick < 1) {
            ctx.player.sendMessage('§c数值必须大于 0');
            return false;
        }
        if (perTick > perSecond) {
            ctx.player.sendMessage('§c每 tick 数量不能超过每秒数量');
            return false;
        }
        const registry = ConfigRegistry.getInstance();
        registry.getServerRateLimitStorage().set(perSecond, perTick);
        this.feedback(ctx, 'veinminer.cmd.rateSet', perSecond, perTick);
        return true;
    }
}
