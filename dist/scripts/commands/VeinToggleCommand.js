/**
 * VeinToggleCommand.ts
 * 职责：/vein toggle - 快速切换个人连锁开关
 */
import { CommandBase } from './CommandBase';
import { ConfigRegistry } from '../config/registry/ConfigRegistry';
export class VeinToggleCommand extends CommandBase {
    meta = {
        name: 'toggle',
        description: '快速切换连锁开关',
        usage: '/vein toggle',
        opOnly: false,
        env: 'all'
    };
    execute(ctx) {
        const registry = ConfigRegistry.getInstance();
        const current = registry.getPersonalToggle(ctx.player);
        const next = !current;
        registry.setPersonalToggle(ctx.player, next);
        this.feedback(ctx, next ? 'veinminer.msg.enabled' : 'veinminer.msg.disabled');
        return true;
    }
}
