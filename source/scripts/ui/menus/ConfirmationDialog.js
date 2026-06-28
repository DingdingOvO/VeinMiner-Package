/**
 * ConfirmationDialog.ts
 * 职责：通用确认对话框
 */
import { ModalFormData } from '@minecraft/server-ui';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
export class ConfirmationDialog {
    /**
     * 显示确认对话框
     * @returns true=确认, false=取消
     */
    static async show(player, messageKey, ...args) {
        try {
            const form = new ModalFormData();
            form.title(I18n.for(player, 'veinminer.ui.confirm'));
            form.label(I18n.for(player, messageKey, ...args));
            form.toggle(I18n.for(player, 'veinminer.ui.confirm'), { defaultValue: false });
            const response = await form.show(player);
            if (response.canceled)
                return false;
            return Boolean(response.formValues?.[0]);
        }
        catch (err) {
            Logger.error('ConfirmationDialog 显示失败', err);
            return false;
        }
    }
}
