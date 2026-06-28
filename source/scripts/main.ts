/**
 * main.ts - VeinMiner 纯行为包入口
 *
 * 触发方式：
 *   - 潜行 + 挖方块 → 连锁采集
 *   - /scriptevent veinminer:toggle → 开关连锁
 *   - /scriptevent veinminer:settings → 打开设置表单 (server-ui)
 */

import { world, system, Player, ScriptEventSource, ScriptEventCommandMessageAfterEvent } from '@minecraft/server';
import { EnvironmentDetector } from './utils/EnvironmentDetector';
import { Logger } from './utils/Logger';
import { PerformanceGuard } from './utils/PerformanceGuard';
import { DataMigrator } from './data/storage/DataMigrator';
import { ConfigRegistry } from './config/registry/ConfigRegistry';
import { EventListener } from './core/controller/EventListener';
import { MainMenu } from './ui/menus/MainMenu';

const TAG = '§8[VM]§r';

function main(): void {
    try {
        Logger.info('=======================================');
        Logger.info('  VeinMiner v0.0.1-alpha 启动中...');
        Logger.info('=======================================');

        const env = EnvironmentDetector.detect();
        Logger.info(`运行环境: ${env === 'server' ? '服务端模式 (BDS)' : '客户端模式 (单机/局域网)'}`);

        EventListener.register();

        // 性能监控 + tick 计数
        let tickCount = 0;
        system.runInterval(() => {
            tickCount++;
            Logger.tick(tickCount);
            PerformanceGuard.onTick();
        }, 1);

        // ★ scriptEvent 监听 ★
        try {
            system.afterEvents.scriptEventReceive.subscribe(
                (event: ScriptEventCommandMessageAfterEvent) => {
                    if (event.sourceType !== ScriptEventSource.Entity) return;
                    const entity = event.sourceEntity;
                    if (!entity || !(entity instanceof Player)) return;

                    if (event.id === 'veinminer:toggle') {
                        handleToggle(entity as Player);
                    } else if (event.id === 'veinminer:settings') {
                        handleSettings(entity as Player);
                    }
                },
                { namespaces: ['veinminer'] }
            );
            Logger.info('scriptEvent 监听已注册');
        } catch (err) {
            Logger.error('scriptEventReceive 注册失败', err);
        }

        Logger.info('=======================================');
        Logger.info('  VeinMiner 启动完成');
        Logger.info('  潜行 + 挖方块 → 连锁采集');
        Logger.info('  /scriptevent veinminer:toggle → 开关');
        Logger.info('  /scriptevent veinminer:settings → 设置');
        Logger.info('=======================================');

        // 延迟初始化
        system.run(() => {
            try { DataMigrator.migrate(); } catch (e) { Logger.error('数据迁移失败(延迟)', e); }
            try { ConfigRegistry.getInstance(); } catch (e) { Logger.error('配置加载失败(延迟)', e); }
            for (const player of world.getAllPlayers()) {
                player.onScreenDisplay.setActionBar({
                    rawtext: [
                        { text: TAG + ' ' },
                        { translate: 'veinminer.msg.loaded' },
                        { text: ' §7| §f' },
                        { translate: 'veinminer.msg.howToUse' },
                        { text: ' §7| §f/scriptevent veinminer:toggle|settings' }
                    ]
                });
            }
        });
    } catch (err) {
        Logger.error('VeinMiner 启动失败', err);
    }
}

/** /scriptevent veinminer:toggle → 切换开关 */
function handleToggle(player: Player): void {
    try {
        const registry = ConfigRegistry.getInstance();
        const isOn = registry.getPersonalToggle(player);
        const next = !isOn;
        registry.setPersonalToggle(player, next);
        player.onScreenDisplay.setActionBar({
            rawtext: [
                { text: TAG + ' ' },
                { translate: next ? 'veinminer.msg.enabled' : 'veinminer.msg.disabled' }
            ]
        });
    } catch (err) {
        Logger.error('切换开关失败', err);
    }
}

/** /scriptevent veinminer:settings → 打开主菜单 */
async function handleSettings(player: Player): Promise<void> {
    try {
        await MainMenu.show(player);
    } catch (err) {
        Logger.error('主菜单显示失败', err);
    }
}

main();