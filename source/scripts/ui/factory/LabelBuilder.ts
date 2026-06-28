/**
 * LabelBuilder.ts
 * 职责：构建 ModalForm 标签
 */

import { ModalFormData } from '@minecraft/server-ui';

export class LabelBuilder {
    public static add(form: ModalFormData, textKey: string): void {
        form.label(textKey);
    }
}