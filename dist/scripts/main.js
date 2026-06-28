/**
 * main.ts - VeinMiner 行为包入口
 *
 * 触发方式：
 *   - 潜行 + 挖方块 → 连锁采集
 *   - HUD 按钮（屏幕右上角）：
 *       VM  → 直接开关连锁
 *       ⚙   → 打开设置表单
 *   HUD 按钮通过 /scriptevent 与服务端通信
 */
import { world, system, Player, ScriptEventSource } from '@minecraft/server';
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
function main() {
    try {
        Logger.info('=======================================');
        Logger.info('  VeinMiner 连锁采集 v0.2.0-beta 启动中...');
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
        // ★ HUD 按钮监听：通过 scriptEvent 接收客户端 UI 按钮点击 ★
        try {
            system.afterEvents.scriptEventReceive.subscribe((event) => {
                // 只接受来自玩家的 scriptevent
                if (event.sourceType !== ScriptEventSource.Entity)
                    return;
                const entity = event.sourceEntity;
                if (!entity || !(entity instanceof Player))
                    return;
                if (event.id === 'veinminer:toggle') {
                    handleToggle(entity);
                }
                else if (event.id === 'veinminer:settings') {
                    handleSettings(entity);
                }
            }, { namespaces: ['veinminer'] });
            Logger.info('HUD 按钮监听已注册 (scriptEventReceive)');
        }
        catch (err) {
            Logger.error('scriptEventReceive 注册失败', err);
        }
        Logger.info('=======================================');
        Logger.info('  VeinMiner 启动完成');
        Logger.info('  潜行 + 挖方块 → 连锁采集');
        Logger.info('  HUD [VM] 按钮 → 开关连锁');
        Logger.info('  HUD [⚙] 按钮 → 设置');
        Logger.info('=======================================');
        // 延迟初始化（避免 early execution）
        system.run(() => {
            try {
                DataMigrator.migrate();
            }
            catch (e) {
                Logger.error('数据迁移失败(延迟)', e);
            }
            try {
                ConfigRegistry.getInstance();
            }
            catch (e) {
                Logger.error('配置加载失败(延迟)', e);
            }
            for (const player of world.getAllPlayers()) {
                player.onScreenDisplay.setActionBar(`${TAG} §a已加载 §7| §f潜行+挖掘 连锁 §7| §fHUD按钮 开关/设置`);
            }
        });
    }
    catch (err) {
        Logger.error('VeinMiner 启动失败', err);
    }
}
// ============================================================
// HUD 按钮处理
// ============================================================
/** VM 按钮：直接切换开关 */
function handleToggle(player) {
    try {
        const registry = ConfigRegistry.getInstance();
        const isOn = registry.getPersonalToggle(player);
        const next = !isOn;
        registry.setPersonalToggle(player, next);
        player.onScreenDisplay.setActionBar(`${TAG} ${next ? '§a连锁采集 已开启' : '§c连锁采集 已关闭'}`);
    }
    catch (err) {
        Logger.error('切换开关失败', err);
    }
}
/** ⚙ 按钮：直接打开设置表单（ModalFormData） */
async function handleSettings(player) {
    try {
        // 读当前值
        let currentMaxVein = 64;
        let collectDrops = true;
        try {
            const personal = player.getDynamicProperty('veinminer:personal_maxvein');
            if (typeof personal === 'number')
                currentMaxVein = personal;
            const cd = player.getDynamicProperty('veinminer:collect_drops');
            if (cd === false)
                collectDrops = false;
        }
        catch { /* use defaults */ }
        const form = new ModalFormData();
        form.title(`${TAG} §e⚙ 设置`);
        form.slider('最大连锁数', SLIDER_MIN, SLIDER_MAX, { defaultValue: currentMaxVein });
        form.toggle('掉落物集中到挖掘格', { defaultValue: collectDrops });
        const response = await form.show(player);
        if (response.canceled)
            return;
        const values = response.formValues;
        if (!values)
            return;
        // 保存最大连锁数
        try {
            player.setDynamicProperty('veinminer:max_vein', values[0]);
        }
        catch (err) {
            Logger.error('保存最大连锁数失败', err);
        }
        // 保存掉落物集中
        try {
            player.setDynamicProperty('veinminer:collect_drops', values[1]);
        }
        catch (err) {
            Logger.error('保存掉落物集中设置失败', err);
        }
        player.onScreenDisplay.setActionBar(`${TAG} §a设置已保存`);
    }
    catch (err) {
        Logger.error('设置表单显示失败', err);
    }
}
main();
