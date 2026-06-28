/**
 * SliderBuilder.ts
 * 职责：构建 ModalForm 滑块
 */
import { I18n } from '../../utils/I18n';
import { SLIDER_MIN, SLIDER_MAX } from '../../config/shared/ui/index.js';
export class SliderBuilder {
    static add(form, player, textKey, defaultValue) {
        form.slider(I18n.for(player, textKey), SLIDER_MIN, SLIDER_MAX, { defaultValue: defaultValue ?? Math.floor(SLIDER_MAX / 2) });
    }
}
