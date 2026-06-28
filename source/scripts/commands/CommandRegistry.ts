/**
 * CommandRegistry.ts
 * 职责：命令注册中心，统一管理所有 /vein 子命令
 */

import { Player } from '@minecraft/server';
import { CommandBase, CommandContext } from './CommandBase';
import { Lang } from '../utils/Lang';
import { Logger } from '../utils/Logger';
import { EnvironmentDetector } from '../utils/EnvironmentDetector';

export class CommandRegistry {
    /** 注册的命令表（按 name 索引） */
    private static commands: Map<string, CommandBase> = new Map();

    /**
     * 注册命令
     */
    public static register(cmd: CommandBase): void {
        const name = cmd.meta.name;
        if (this.commands.has(name)) {
            Logger.warn(`命令 ${name} 已存在，覆盖注册`);
        }
        this.commands.set(name, cmd);
        Logger.debug(`已注册命令: ${name}`);
    }

    /**
     * 注册所有命令（启动时调用）
     */
    public static registerAll(cmds: CommandBase[]): void {
        for (const c of cmds) {
            this.register(c);
        }
        Logger.info(`命令注册完成，共 ${this.commands.size} 个命令`);
    }

    /**
     * 分发执行
     */
    public static dispatch(player: Player, args: string[]): void {
        try {
            // 无参数 → 打开主菜单
            if (args.length === 0) {
                this.openMainMenu(player);
                return;
            }

            const subName = args[0].toLowerCase();
            const subArgs = args.slice(1);
            const cmd = this.commands.get(subName);

            if (!cmd) {
                Lang.msg(player, 'veinminer.cmd.notFound');
                return;
            }

            // 环境检查
            if (cmd.meta.env === 'server' && !EnvironmentDetector.isServer()) {
                Lang.msg(player, 'veinminer.cmd.cmdNotAvailable');
                return;
            }
            if (cmd.meta.env === 'client' && !EnvironmentDetector.isClient()) {
                Lang.msg(player, 'veinminer.cmd.cmdNotAvailable');
                return;
            }

            const ctx: CommandContext = { player, args: subArgs };

            // 权限检查
            if (cmd.meta.opOnly && !this.isOp(player)) {
                Lang.msg(player, 'veinminer.cmd.onlyOp');
                return;
            }

            const success = cmd.execute(ctx);
            if (!success) {
                Logger.debug(`命令 ${subName} 执行失败`);
            }
        } catch (err) {
            Logger.error('命令分发异常', err);
            Lang.msg(player, 'veinminer.error.generic');
        }
    }

    /**
     * 打开主菜单
     */
    private static openMainMenu(player: Player): void {
        import('../ui/menus/MainMenu').then(m => {
            m.MainMenu.show(player).catch(err => {
                Logger.error('打开主菜单失败', err);
            });
        });
    }

    /**
     * 判断 OP（安全优先返回 false）
     */
    private static isOp(player: Player): boolean {
        try {
            return (player as unknown as { isOp?: () => boolean }).isOp?.() ?? false;
        } catch {
            return false;
        }
    }

    /**
     * 获取所有已注册命令
     */
    public static list(): CommandBase[] {
        return Array.from(this.commands.values());
    }
}