/**
 * AdvancedSettingsModal.ts
 * 职责：高级设置弹窗（调整最大连锁数等）
 */

import { Player } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { Lang } from '../../utils/Lang';
import { Logger } from '../../utils/Logger';
import { SLIDER_MIN, SLIDER_MAX } from '../../config/shared/ui';

export class AdvancedSettingsModal {
    public static async show(player: Player): Promise<void> {
        try {
            const registry = ConfigRegistry.getInstance();
            const clientRegistry = registry.getClientRegistry();
            const current = clientRegistry.getMaxVeinManager().get(player);

            const form = new ModalFormData();
            form.title('veinminer.ui.maxBlocks');
            form.slider('veinminer.ui.maxBlocks', SLIDER_MIN, SLIDER_MAX, { defaultValue: current });

            const response = await form.show(player);
            if (response.canceled) return;

            const value = response.formValues?.[0] as number;
            clientRegistry.getMaxVeinManager().set(player, value);
            Lang.msg(player, 'veinminer.cmd.success');
        } catch (err) {
            Logger.error('AdvancedSettingsModal 显示失败', err);
        }
    }
}