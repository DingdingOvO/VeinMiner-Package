/**
 * ModalFormFactory.ts
 * 职责：ModalForm 创建工厂
 */

import { ModalFormData } from '@minecraft/server-ui';
import { Player } from '@minecraft/server';

export class ModalFormFactory {
    public static create(_player: Player, titleKey: string): ModalFormData {
        const form = new ModalFormData();
        form.title(titleKey);
        return form;
    }
}