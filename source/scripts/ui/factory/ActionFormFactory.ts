/**
 * ActionFormFactory.ts
 * 职责：ActionForm 创建工厂
 */

import { ActionFormData } from '@minecraft/server-ui';
import { Player } from '@minecraft/server';
import { I18n } from '../../utils/I18n';

export class ActionFormFactory {
    public static create(player: Player, titleKey: string, bodyKey?: string, ...args: unknown[]): ActionFormData {
        const form = new ActionFormData();
        form.title(I18n.for(player, titleKey));
        if (bodyKey) {
            form.body(I18n.for(player, bodyKey, ...args));
        }
        return form;
    }
}
