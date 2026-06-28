/**
 * LabelBuilder.ts
 * 职责：构建 ModalForm 标签
 */
import { I18n } from '../../utils/I18n';
export class LabelBuilder {
    static add(form, player, textKey, ...args) {
        form.label(I18n.for(player, textKey, ...args));
    }
}
