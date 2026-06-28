/**
 * AdvancedSettingsModal - 设置面板
 */
import { ModalFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
const TAG = '§8[VM]§r';
export class AdvancedSettingsModal {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const clientRegistry = registry.getClientRegistry();
            const currentMax = clientRegistry.getMaxVeinManager().get(player);
            // 掉落物集中开关
            let collectDrops = true;
            try { collectDrops = player.getDynamicProperty('veinminer:collect_drops') ?? true; } catch { }
            const form = new ModalFormData();
            form.title('§e⚙ 设置');
            form.slider('最大连锁数', 1, 256, { defaultValue: currentMax, stepSize: 1 });
            form.toggle('掉落物集中到挖掘格', collectDrops);
            const response = await form.show(player);
            if (response.canceled) return;
            // 保存最大连锁数
            const maxVal = response.formValues?.[0];
            if (maxVal !== undefined) {
                clientRegistry.getMaxVeinManager().set(player, maxVal);
            }
            // 保存掉落物设置
            const collectVal = response.formValues?.[1];
            if (collectVal !== undefined) {
                try { player.setDynamicProperty('veinminer:collect_drops', collectVal); } catch { }
            }
            player.onScreenDisplay.setActionBar(`${TAG} §a设置已保存`);
        }
        catch (err) {
            Logger.error('Settings 显示失败', err);
        }
    }
}