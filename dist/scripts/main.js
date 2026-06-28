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
        Logger.info('  VeinMiner 连锁采集 v0.2.0-beta');
        Logger.info('=======================================');
        const env = EnvironmentDetector.detect();
        Logger.info(`环境: ${env === 'server' ? '服务端 (BDS)' : '客户端 (单机/局域网)'}`);
        I18n.init();
        registerAllCommands();
        EventListener.register();

        // 性能监控
        let tickCount = 0;
        system.runInterval(() => {
            tickCount++;
            Logger.tick(tickCount);
            PerformanceGuard.onTick();
        }, 1);

        // ========== UI 触发 ==========
        // 1) 潜行 + 右键方块 → 打开菜单（主快捷键）
        try {
            world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
                if (!event.player.isSneaking) return;
                // 只在非方块激活交互时触发（避免开箱子等）
                const block = event.block;
                // 检查方块是否可交互（箱子、门等），如果是则不拦截
                const interactable = block.getComponent('minecraft:inventory') || block.getComponent('minecraft:sign');
                if (interactable) return;
                event.cancel = true;
                system.run(() => { CommandRegistry.openMainMenu(event.player); });
            });
            Logger.info('快捷键已注册: 潜行+右键 → 打开菜单');
        } catch (err) {
            Logger.error('快捷键注册失败', err);
        }

        // 2) #vein 聊天 → 备用触发
        try {
            world.beforeEvents.chatSend.subscribe((event) => {
                const msg = event.message.trim();
                if (msg.startsWith('#vein ') || msg === '#vein') {
                    event.cancel = true;
                    const args = msg.split(/\s+/).slice(1).filter(a => a.length > 0);
                    system.run(() => { CommandRegistry.dispatch(event.sender, args); });
                }
            });
            Logger.info('备用触发: #vein 聊天');
        } catch (err) {
            Logger.error('聊天触发注册失败', err);
        }

        Logger.info('=======================================');
        Logger.info('  VeinMiner 启动完成');
        Logger.info('  潜行+挖方块 → 连锁采集');
        Logger.info('  潜行+右键  → 打开菜单');
        Logger.info('=======================================');

        // 延迟初始化（避免 early execution）
        system.run(() => {
            try { DataMigrator.migrate(); } catch (e) { Logger.error('数据迁移失败', e); }
            try { ConfigRegistry.getInstance(); } catch (e) { Logger.error('配置加载失败', e); }
            for (const player of world.getAllPlayers()) {
                player.onScreenDisplay.setActionBar(`§a[VM]§r §7已加载 §b| §fShift+右键 菜单`);
            }
        });
    } catch (err) {
        Logger.error('VeinMiner 启动失败', err);
    }
}
main();