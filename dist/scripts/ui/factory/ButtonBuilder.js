/**
 * ButtonBuilder.ts
 * 职责：构建 ActionForm 按钮
 */
import { I18n } from '../../utils/I18n';
export class ButtonBuilder {
    /**
     * 添加按钮（使用本地化文本）
     */
    static add(form, player, textKey, ...args) {
        const text = I18n.for(player, textKey, ...args);
        form.button(text);
    }
    /**
     * 添加带图标的按钮
     */
    static addWithIcon(form, player, textKey, iconPath, ...args) {
        const text = I18n.for(player, textKey, ...args);
        form.button(text, iconPath);
    }
}
