/**
 * ActionFormFactory.ts
 * 职责：ActionForm 创建工厂
 */
import { ActionFormData } from '@minecraft/server-ui';
import { I18n } from '../../utils/I18n';
export class ActionFormFactory {
    static create(player, titleKey, bodyKey, ...args) {
        const form = new ActionFormData();
        form.title(I18n.for(player, titleKey));
        if (bodyKey) {
            form.body(I18n.for(player, bodyKey, ...args));
        }
        return form;
    }
}
