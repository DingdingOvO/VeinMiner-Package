/**
 * ButtonBuilder.ts
 * 职责：构建 ActionForm 按钮
 */

import { ActionFormData } from '@minecraft/server-ui';
import { I18n } from '../../utils/I18n';
import { Player } from '@minecraft/server';

export class ButtonBuilder {
    /**
     * 添加按钮（使用本地化文本）
     */
    public static add(form: ActionFormData, player: Player, textKey: string, ...args: unknown[]): void {
        const text = I18n.for(player, textKey, ...args);
        form.button(text);
    }

    /**
     * 添加带图标的按钮
     */
    public static addWithIcon(form: ActionFormData, player: Player, textKey: string, iconPath: string, ...args: unknown[]): void {
        const text = I18n.for(player, textKey, ...args);
        form.button(text, iconPath);
    }
}
