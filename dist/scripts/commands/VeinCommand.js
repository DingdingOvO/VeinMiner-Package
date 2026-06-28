/**
 * VeinCommand.ts
 * 职责：/vein 主命令（无参数时打开主菜单）
 */
import { CommandBase } from './CommandBase';
export class VeinCommand extends CommandBase {
    meta = {
        name: 'vein',
        description: '打开 VeinMiner 主菜单',
        usage: '/vein',
        opOnly: false,
        env: 'all'
    };
    execute(ctx) {
        // 主菜单由 CommandRegistry 在分发时直接处理
        // 走到这里说明命令格式异常
        ctx.player.sendMessage('VeinMiner - 使用 /vein <子命令> 查看更多选项');
        return true;
    }
}
