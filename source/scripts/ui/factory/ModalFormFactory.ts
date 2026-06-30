/**
 * ModalFormFactory.ts
 * 职责：ModalFormData 创建工厂
 */

import { ModalFormData } from '@minecraft/server-ui';
import { Player } from '@minecraft/server';
import { I18n } from '../../utils/I18n';

export class ModalFormFactory {
    public static create(player: Player, titleKey: string): ModalFormData {
        const form = new ModalFormData();
        form.title(I18n.for(player, titleKey));
        return form;
    }
}
