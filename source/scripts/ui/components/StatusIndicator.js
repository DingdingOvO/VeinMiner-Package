/**
 * StatusIndicator.ts
 * 职责：状态指示器组件
 */
import { I18n } from '../../utils/I18n';
export class StatusIndicator {
    static render(player, enabled) {
        return enabled
            ? `§a● ${I18n.for(player, 'veinminer.ui.enabled')}§r`
            : `§c● ${I18n.for(player, 'veinminer.ui.disabled')}§r`;
    }
}
