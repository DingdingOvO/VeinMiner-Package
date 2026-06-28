/**
 * SliderBuilder.ts
 * 职责：构建 ModalForm 滑块
 */

import { ModalFormData } from '@minecraft/server-ui';
import { I18n } from '../../utils/I18n';
import { Player } from '@minecraft/server';
import { SLIDER_MIN, SLIDER_MAX } from '../../config/shared/ui';

export class SliderBuilder {
    public static add(form: ModalFormData, player: Player, textKey: string, defaultValue?: number): void {
        form.slider(
            I18n.for(player, textKey),
            SLIDER_MIN,
            SLIDER_MAX,
            { defaultValue: defaultValue ?? Math.floor(SLIDER_MAX / 2) }
        );
    }
}
