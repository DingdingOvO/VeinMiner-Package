/**
 * VeinReloadCommand.ts
 * 职责：/vein reload - 重新加载所有配置
 * 客户端模式：重载个人配置
 * 服务端模式：重载服务端 + 共享配置
 */

import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
import { Logger } from '../utils/Logger';

export class VeinReloadCommand extends CommandBase {
    public readonly meta: CommandMeta = {
        name: 'reload',
        description: '重新加载所有配置',
        usage: '/vein reload',
        opOnly: true,
        env: 'all'
    };

    public execute(ctx: CommandContext): boolean {
        try {
            const registry = ConfigRegistry.getInstance();
            registry.reload();
            this.feedback(ctx, 'veinminer.cmd.reloadSuccess');
            Logger.info(`玩家 ${ctx.player.name} 触发了配置重新加载`);
            return true;
        } catch (err) {
            Logger.error('配置重新加载失败', err);
            this.feedback(ctx, 'veinminer.cmd.reloadFailed');
            return false;
        }
    }
}
