/**
 * main.ts ★ VeinMiner 行为包入口 ★
 */
import { world, system } from '@minecraft/server';
import { EnvironmentDetector } from './utils/EnvironmentDetector';
import { I18n } from './utils/I18n';
import { Logger } from './utils/Logger';
import { PerformanceGuard } from './utils/PerformanceGuard';
import { DataMigrator } from './data/storage/DataMigrator';
import { ConfigRegistry } from './config/registry/ConfigRegistry';
import { registerAllCommands, CommandRegistry } from './commands/index.js';
import { EventListener } from './core/controller/EventListener';
function main() {
    try {
        Logger.info('=======================================');
        Logger.info('  VeinMiner 连锁采集 v1.0.1 启动中...');
        Logger.info('=======================================');
        const env = EnvironmentDetector.detect();
        Logger.info(`运行环境: ${env === 'server' ? '服务端模式 (BDS)' : '客户端模式 (单机/局域网)'}`);
        I18n.init();
        registerAllCommands();
        EventListener.register();
        // 性能监控 + tick 计数
        let tickCount = 0;
        system.runInterval(() => {
            tickCount++;
            Logger.tick(tickCount);
            PerformanceGuard.onTick();
        }, 1);
        // /vein 命令
        try {
            world.beforeEvents.chatSend.subscribe((event) => {
                const msg = event.message.trim();
                if (msg.startsWith('/vein ') || msg === '/vein') {
                    event.cancel = true;
                    const args = msg.split(/\s+/).slice(1).filter(a => a.length > 0);
                    const sender = event.sender;
                    system.run(() => { CommandRegistry.dispatch(sender, args); });
                }
            });
            Logger.info('/vein 命令已注册（通过 chat 拦截）');
        }
        catch (err) {
            Logger.error('命令注册失败', err);
        }
        Logger.info('=======================================');
        Logger.info('  VeinMiner 启动完成');
        Logger.info('  使用方法: 潜行 + 挖方块 触发连锁');
        Logger.info('  命令: /vein 打开设置菜单');
        Logger.info('=======================================');
        // 延迟到下一 tick 再访问 world（避免 early execution 错误）
        system.run(() => {
            try { DataMigrator.migrate(); } catch (e) { Logger.error('数据迁移失败(延迟)', e); }
            try { ConfigRegistry.getInstance(); } catch (e) { Logger.error('配置加载失败(延迟)', e); }
            for (const player of world.getAllPlayers()) {
                player.onScreenDisplay.setActionBar(`§a[VeinMiner]§r §7已加载 §b| §f潜行+挖掘 连锁 §b| §f/vein 菜单`);
            }
        });
    }
    catch (err) {
        Logger.error('VeinMiner 启动失败', err);
    }
}
main();
