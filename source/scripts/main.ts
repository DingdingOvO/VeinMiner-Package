/**
 * main.ts — VeinMiner v0.0.1-alpha 入口
 *
 * 触发方式：
 *   - 潜行 + 挖方块 → 连锁采集
 *   - /scriptevent veinminer:toggle   → 开关连锁
 *   - /scriptevent veinminer:settings → 设置 (server-ui ModalFormData)
 */

import { world, system, Player, ScriptEventSource, ScriptEventCommandMessageAfterEvent } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { registerVeinMiner } from './VeinMiner';
import {
    getPlayerToggle, setPlayerToggle,
    getPlayerMaxVein, setPlayerMaxVein,
    getPlayerCollectDrops, setPlayerCollectDrops,
    SLIDER_MIN, SLIDER_MAX,
} from './Config';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  启动
// ═══════════════════════════════════════

console.warn('[VM] VeinMiner v0.0.1-alpha 启动中...');

registerVeinMiner();

// scriptEvent 监听
system.afterEvents.scriptEventReceive.subscribe(
    (event: ScriptEventCommandMessageAfterEvent) => {
        if (event.sourceType !== ScriptEventSource.Entity) return;
        const entity = event.sourceEntity;
        if (!entity || !(entity instanceof Player)) return;

        if (event.id === 'veinminer:toggle') {
            handleToggle(entity);
        } else if (event.id === 'veinminer:settings') {
            handleSettings(entity);
        }
    },
    { namespaces: ['veinminer'] },
);

console.warn('[VM] 启动完成');

// 在线玩家提示
system.run(() => {
    for (const player of world.getAllPlayers()) {
        player.onScreenDisplay.setActionBar(
            `${TAG} §a已加载 §7| §f潜行+挖掘 连锁 §7| §f/scriptevent veinminer:toggle|settings`,
        );
    }
});

// ═══════════════════════════════════════
//  scriptEvent 处理
// ═══════════════════════════════════════

function handleToggle(player: Player): void {
    const next = !getPlayerToggle(player);
    setPlayerToggle(player, next);
    player.onScreenDisplay.setActionBar(`${TAG} ${next ? '§a连锁采集 已开启' : '§c连锁采集 已关闭'}`);
}

async function handleSettings(player: Player): Promise<void> {
    try {
        const form = new ModalFormData();
        form.title(`${TAG} §e设置`);
        form.slider('最大连锁数', SLIDER_MIN, SLIDER_MAX, { defaultValue: getPlayerMaxVein(player) });
        form.toggle('掉落物集中到挖掘格', { defaultValue: getPlayerCollectDrops(player) });

        const resp = await form.show(player);
        if (resp.canceled || !resp.formValues) return;

        setPlayerMaxVein(player, resp.formValues[0] as number);
        setPlayerCollectDrops(player, resp.formValues[1] as boolean);

        player.onScreenDisplay.setActionBar(`${TAG} §a设置已保存`);
    } catch (err) {
        console.warn('[VM] 设置表单失败', err);
    }
}