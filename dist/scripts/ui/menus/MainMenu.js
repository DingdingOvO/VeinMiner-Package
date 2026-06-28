/**
 * MainMenu.ts ★ 主菜单：开关 + 设置 ★
 */
import { ActionFormData } from '@minecraft/server-ui';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { I18n } from '../../utils/I18n';
import { Logger } from '../../utils/Logger';
import { AdvancedSettingsModal } from './AdvancedSettingsModal';
const TAG = '§8[VM]§r';
export class MainMenu {
    static async show(player) {
        try {
            const registry = ConfigRegistry.getInstance();
            const isOn = registry.getPersonalToggle(player);
            const form = new ActionFormData();
            form.title('VeinMiner');
            form.body(`${TAG} §7潜行+挖掘 连锁采集`);
            // 开关按钮（文字含当前状态，一眼看出）
            form.button(isOn ? '§a■ 关闭连锁' : '§c■ 开启连锁');
            // 设置按钮
            form.button('§e⚙ 设置');
            const response = await form.show(player);
            if (response.canceled) return;
            if (response.selection === 0) {
                // 切换开关
                const next = !isOn;
                registry.setPersonalToggle(player, next);
                player.onScreenDisplay.setActionBar(`${TAG} ${next ? '§a已开启' : '§c已关闭'}`);
            } else if (response.selection === 1) {
                // 设置
                await AdvancedSettingsModal.show(player);
            }
        }
        catch (err) {
            Logger.error('MainMenu 失败', err);
        }
    }
}