/**
 * LabelBuilder.ts
 * 职责：构建 ModalForm 标签
 */

import { ModalFormData } from '@minecraft/server-ui';
import { I18n } from '../../utils/I18n';
import { Player } from '@minecraft/server';

export class LabelBuilder {
    public static add(form: ModalFormData, player: Player, textKey: string, ...args: unknown[]): void {
        form.label(I18n.for(player, textKey, ...args));
    }
}
