/**
 * main.ts - VeinMiner 纯行为包入口
 *
 * 触发方式：
 *   - 潜行 + 挖方块 → 连锁采集
 *   - /scriptevent veinminer:toggle → 开关连锁
 *   - /scriptevent veinminer:settings → 打开设置表单 (server-ui)
 */

import { world, system, Player, ScriptEventSource, ScriptEventCommandMessageAfterEvent } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { EnvironmentDetector } from './utils/EnvironmentDetector';
import { I18n } from './utils/I18n';
import { Logger } from './utils/Logger';
import { PerformanceGuard } from './utils/PerformanceGuard';
import { DataMigrator } from './data/storage/DataMigrator';
import { ConfigRegistry } from './config/registry/ConfigRegistry';
import { EventListener } from './core/controller/EventListener';
import { SLIDER_MIN, SLIDER_MAX } from './config/shared/ui';

const TAG = '§8[VM]§r';

function main(): void {
    try {
        Logger.info('=======================================');
        Logger.info('  VeinMiner 连锁采集 v0.0.1-alpha 启动中...');
        Logger.info('=======================================');

        const env = EnvironmentDetector.detect();
        Logger.info(`运行环境: ${env === 'server' ? '服务端模式 (BDS)' : '客户端模式 (单机/局域网)'}`);

        I18n.init();
        EventListener.register();

        // 性能监控 + tick 计数
        let tickCount = 0;
        system.runInterval(() => {
            tickCount++;
            Logger.tick(tickCount);
            PerformanceGuard.onTick();
        }, 1);

        // ★ scriptEvent 监听：接收 /scriptevent 命令 ★
        try {
            system.afterEvents.scriptEventReceive.subscribe(
                (event: ScriptEventCommandMessageAfterEvent) => {
                    // 只接受来自玩家的 scriptevent
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

        // 延迟初始化（避免 early execution）
        system.run(() => {
            try { DataMigrator.migrate(); } catch (e) { Logger.error('数据迁移失败(延迟)', e); }
            try { ConfigRegistry.getInstance(); } catch (e) { Logger.error('配置加载失败(延迟)', e); }
            for (const player of world.getAllPlayers()) {
                player.onScreenDisplay.setActionBar(`${TAG} §a已加载 §7| §f潜行+挖掘 连锁 §7| §f/scriptevent veinminer:toggle|settings`);
            }
        });
    } catch (err) {
        Logger.error('VeinMiner 启动失败', err);
    }
}

// ============================================================
// scriptEvent 命令处理
// ============================================================

/** /scriptevent veinminer:toggle → 切换开关 */
function handleToggle(player: Player): void {
    try {
        const registry = ConfigRegistry.getInstance();
        const isOn = registry.getPersonalToggle(player);
        const next = !isOn;
        registry.setPersonalToggle(player, next);
        player.onScreenDisplay.setActionBar(`${TAG} ${next ? '§a连锁采集 已开启' : '§c连锁采集 已关闭'}`);
    } catch (err) {
        Logger.error('切换开关失败', err);
    }
}

/** /scriptevent veinminer:settings → 打开设置表单 (server-ui ModalFormData) */
async function handleSettings(player: Player): Promise<void> {
    try {
        // 读当前值
        let currentMaxVein = 64;
        let collectDrops = true;
        try {
            const personal = player.getDynamicProperty('veinminer:personal_maxvein');
            if (typeof personal === 'number') currentMaxVein = personal;
            const cd = player.getDynamicProperty('veinminer:collect_drops');
            if (cd === false) collectDrops = false;
        } catch { /* use defaults */ }

        const form = new ModalFormData();
        form.title(`${TAG} §e⚙ 设置`);
        form.slider('最大连锁数', SLIDER_MIN, SLIDER_MAX, { defaultValue: currentMaxVein });
        form.toggle('掉落物集中到挖掘格', { defaultValue: collectDrops });

        const response = await form.show(player);
        if (response.canceled) return;

        const values = response.formValues;
        if (!values) return;

        // 保存最大连锁数
        try {
            player.setDynamicProperty('veinminer:max_vein', values[0] as number);
        } catch (err) {
            Logger.error('保存最大连锁数失败', err);
        }

        // 保存掉落物集中
        try {
            player.setDynamicProperty('veinminer:collect_drops', values[1] as boolean);
        } catch (err) {
            Logger.error('保存掉落物集中设置失败', err);
        }

        player.onScreenDisplay.setActionBar(`${TAG} §a设置已保存`);
    } catch (err) {
        Logger.error('设置表单显示失败', err);
    }
}

main();