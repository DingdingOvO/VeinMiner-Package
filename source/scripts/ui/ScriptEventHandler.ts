/**
 * ScriptEventHandler.ts — scriptEvent 监听
 *
 * 用于以后资源包 HUD 按钮触发：
 *   /scriptevent veinminer:toggle   → 开关
 *   /scriptevent veinminer:settings → 设置
 *
 * 现在也可以通过聊天手动执行 /scriptevent 来触发
 */

import { system, Player, ScriptEventSource, ScriptEventCommandMessageAfterEvent } from '@minecraft/server';
import { getPlayerToggle, setPlayerToggle } from '../config';
import { showSettings } from './SettingsForm';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  注册
// ═══════════════════════════════════════

export function registerScriptEventHandler(): void {
    system.afterEvents.scriptEventReceive.subscribe(
        (event: ScriptEventCommandMessageAfterEvent) => {
            if (event.sourceType !== ScriptEventSource.Entity) return;
            const entity = event.sourceEntity;
            if (!entity || !(entity instanceof Player)) return;

            if (event.id === 'veinminer:toggle') {
                const next = !getPlayerToggle(entity);
                setPlayerToggle(entity, next);
                entity.onScreenDisplay.setActionBar(
                    `${TAG} ${next ? '§a连锁采集 已开启' : '§c连锁采集 已关闭'}`,
                );
            } else if (event.id === 'veinminer:settings') {
                showSettings(entity);
            }
        },
        { namespaces: ['veinminer'] },
    );
}