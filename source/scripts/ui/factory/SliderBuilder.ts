/**
 * SliderBuilder.ts
 * 职责：构建 ModalForm 滑块
 */

import { ModalFormData } from '@minecraft/server-ui';
import { SLIDER_MIN, SLIDER_MAX } from '../../config/shared/ui';

export class SliderBuilder {
    public static add(form: ModalFormData, textKey: string, defaultValue?: number): void {
        form.slider(textKey, SLIDER_MIN, SLIDER_MAX, { defaultValue: defaultValue ?? Math.floor(SLIDER_MAX / 2) });
    }
}