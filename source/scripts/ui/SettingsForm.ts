/**
 * SettingsForm.ts — 设置表单
 *
 * 使用 server-ui ModalFormData 显示设置界面
 */

import { Player } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import {
    getPlayerToggle, setPlayerToggle,
    getPlayerMaxVein, setPlayerMaxVein,
    getPlayerAutoLeaves, setPlayerAutoLeaves,
    getPlayerCollectDrops, setPlayerCollectDrops,
    SLIDER_MIN, SLIDER_MAX,
} from '../config';

const TAG = '§8[VM]§r';

// ═══════════════════════════════════════
//  显示设置表单
// ═══════════════════════════════════════

export async function showSettings(player: Player): Promise<void> {
    try {
        const form = new ModalFormData();

        form.title(`${TAG} §e设置`);

        form.toggle('连锁采集', { defaultValue: getPlayerToggle(player) });
        form.slider('最大连锁数', SLIDER_MIN, SLIDER_MAX, { defaultValue: getPlayerMaxVein(player) });
        form.toggle('自动破叶', { defaultValue: getPlayerAutoLeaves(player) });
        form.toggle('掉落物集中', { defaultValue: getPlayerCollectDrops(player) });

        // 3×3×3 预留（暂时不可用，显示但不生效）
        // form.toggle('3×3×3 挖掘', { defaultValue: false });

        const response = await form.show(player);
        if (response.canceled || !response.formValues) return;

        const values = response.formValues;

        // 保存设置
        setPlayerToggle(player, values[0] as boolean);
        setPlayerMaxVein(player, values[1] as number);
        setPlayerAutoLeaves(player, values[2] as boolean);
        setPlayerCollectDrops(player, values[3] as boolean);

        player.onScreenDisplay.setActionBar(`${TAG} §a设置已保存`);
    } catch (err) {
        console.warn('[VM] 设置表单失败', err);
    }
}