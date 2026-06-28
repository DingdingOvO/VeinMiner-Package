/**
 * AdvancedSettingsModal.ts
 * 职责：高级设置弹窗（调整最大连锁数等）
 */
import { ModalFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
import { SLIDER_MIN, SLIDER_MAX } from '../../config/shared/ui';
export class AdvancedSettingsModal {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const clientRegistry = registry.getClientRegistry();
            const current = clientRegistry.getMaxVeinManager().get(player);
            const form = new ModalFormData();
            form.title(I18n.for(player, 'veinminer.ui.maxBlocks'));
            form.slider(I18n.for(player, 'veinminer.ui.maxBlocks'), SLIDER_MIN, SLIDER_MAX, { defaultValue: current });
            const response = await form.show(player);
            if (response.canceled)
                return;
            const value = response.formValues?.[0];
            clientRegistry.getMaxVeinManager().set(player, value);
            player.sendMessage(I18n.for(player, 'veinminer.cmd.success'));
        }
        catch (err) {
            Logger.error('AdvancedSettingsModal 显示失败', err);
        }
    }
}
