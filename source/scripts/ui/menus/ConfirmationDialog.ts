/**
 * ConfirmationDialog.ts
 * 职责：通用确认对话框
 * 表单文本直接传翻译 key，游戏引擎自动翻译
 */

import { Player } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { Logger } from '../../utils/Logger';

export class ConfirmationDialog {
    /**
     * 显示确认对话框
     * @returns true=确认, false=取消
     */
    public static async show(player: Player, messageKey: string): Promise<boolean> {
        try {
            const form = new ModalFormData();
            form.title('veinminer.ui.confirm');
            form.label(messageKey);
            form.toggle('veinminer.ui.confirm', { defaultValue: false });

            const response = await form.show(player);
            if (response.canceled) return false;
            return Boolean(response.formValues?.[0]);
        } catch (err) {
            Logger.error('ConfirmationDialog 显示失败', err);
            return false;
        }
    }
}