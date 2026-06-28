/**
 * ButtonBuilder.ts
 * 职责：构建 ActionForm 按钮
 */

import { ActionFormData } from '@minecraft/server-ui';

export class ButtonBuilder {
    /**
     * 添加按钮（直接传翻译 key，游戏引擎自动翻译）
     */
    public static add(form: ActionFormData, textKey: string): void {
        form.button(textKey);
    }

    /**
     * 添加带图标的按钮
     */
    public static addWithIcon(form: ActionFormData, textKey: string, iconPath: string): void {
        form.button(textKey, iconPath);
    }
}