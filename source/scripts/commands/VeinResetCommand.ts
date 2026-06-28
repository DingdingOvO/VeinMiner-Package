/**
 * VeinResetCommand.ts
 * 职责：/vein reset <玩家名> | all - 重置玩家数据
 * 客户端模式：重置个人设置（白名单、上限、开关）
 * 服务端模式：重置玩家的开关状态（若允许）
 */

import { world, Player } from '@minecraft/server';
import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
import { Logger } from '../utils/Logger';

export class VeinResetCommand extends CommandBase {
    public readonly meta: CommandMeta = {
        name: 'reset',
        description: '重置玩家数据',
        usage: '/vein reset <玩家名|all>',
        opOnly: true,
        env: 'all'
    };

    public execute(ctx: CommandContext): boolean {
        const target = this.arg(ctx, 0);
        if (!target) {
            ctx.player.sendMessage('§c' + this.meta.usage);
            return false;
        }

        const registry = ConfigRegistry.getInstance();

        if (target.toLowerCase() === 'all') {
            // 重置所有玩家
            const players = world.getAllPlayers();
            for (const p of players) {
                registry.resetPlayerData(p);
            }
            this.feedback(ctx, 'veinminer.cmd.resetAllDone');
            Logger.info(`玩家 ${ctx.player.name} 重置了所有玩家数据`);
            return true;
        }

        // 查找指定玩家
        const targetPlayer = this.findPlayer(target);
        if (!targetPlayer) {
            ctx.player.sendMessage(`§c未找到玩家: ${target}`);
            return false;
        }

        registry.resetPlayerData(targetPlayer);
        this.feedback(ctx, 'veinminer.cmd.resetDone', targetPlayer.name);
        Logger.info(`玩家 ${ctx.player.name} 重置了 ${targetPlayer.name} 的数据`);
        return true;
    }

    /**
     * 模糊查找玩家（按名称）
     */
    private findPlayer(name: string): Player | undefined {
        const lower = name.toLowerCase();
        return world.getAllPlayers().find(p =>
            p.name.toLowerCase() === lower ||
            p.name.toLowerCase().includes(lower)
        );
    }
}
