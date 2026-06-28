/**
 * CommandRegistry.ts
 * 职责：命令注册中心，统一管理所有 /vein 子命令
 * 负责命令分发、参数解析、权限与环境检查
 */
import { I18n } from '../utils/I18n';
import { Logger } from '../utils/Logger';
import { EnvironmentDetector } from '../utils/EnvironmentDetector';
export class CommandRegistry {
    /** 注册的命令表（按 name 索引） */
    static commands = new Map();
    /**
     * 注册命令
     */
    static register(cmd) {
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
    static registerAll(cmds) {
        for (const c of cmds) {
            this.register(c);
        }
        Logger.info(`命令注册完成，共 ${this.commands.size} 个命令`);
    }
    /**
     * 分发执行
     * @param player 执行玩家
     * @param args 命令参数（args[0] 是子命令名）
     */
    static dispatch(player, args) {
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
                player.sendMessage(I18n.for(player, 'veinminer.cmd.notFound'));
                return;
            }
            // 环境检查
            if (cmd.meta.env === 'server' && !EnvironmentDetector.isServer()) {
                player.sendMessage(I18n.for(player, 'veinminer.cmd.cmdNotAvailable'));
                return;
            }
            if (cmd.meta.env === 'client' && !EnvironmentDetector.isClient()) {
                player.sendMessage(I18n.for(player, 'veinminer.cmd.cmdNotAvailable'));
                return;
            }
            // 权限检查
            const ctx = {
                player,
                args: subArgs,
                lang: I18n.detectPlayerLang(player)
            };
            if (cmd.meta.opOnly && !this.isOp(player)) {
                player.sendMessage(I18n.for(player, 'veinminer.cmd.onlyOp'));
                return;
            }
            const success = cmd.execute(ctx);
            if (!success) {
                Logger.debug(`命令 ${subName} 执行失败`);
            }
        }
        catch (err) {
            Logger.error('命令分发异常', err);
            player.sendMessage(I18n.for(player, 'veinminer.error.generic'));
        }
    }
    /**
     * 打开主菜单
     */
    static openMainMenu(player) {
        import('../ui/menus/MainMenu/index.js').then(m => {
            m.MainMenu.show(player).catch(err => {
                Logger.error('打开菜单失败', err);
            });
        });
    }
    /**
     * 判断 OP
     */
    static isOp(player) {
        try {
            return player.isOp?.() ?? true;
        }
        catch {
            return true;
        }
    }
    /**
     * 获取所有已注册命令
     */
    static list() {
        return Array.from(this.commands.values());
    }
}
