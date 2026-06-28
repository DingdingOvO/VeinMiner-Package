/**
 * StatusIndicator.ts
 * 职责：状态指示器（rawtext 节点，用于 form body 组合）
 */

import { RawMessage } from '@minecraft/server';

export class StatusIndicator {
    /**
     * 返回 rawtext 节点，用于在 rawtext 数组中组合
     */
    public static render(enabled: boolean): RawMessage {
        return {
            rawtext: [
                { text: enabled ? '§a● ' : '§c● ' },
                { translate: enabled ? 'veinminer.ui.enabled' : 'veinminer.ui.disabled' },
                { text: '§r' }
            ]
        };
    }
}