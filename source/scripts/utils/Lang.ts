/**
 * Lang.ts
 * 职责：使用 Minecraft 原生 rawtext translate/with 发送翻译消息
 *
 * 行为包的 texts/*.lang 文件由游戏引擎自动根据玩家语言加载。
 * UI 表单（ActionFormData/ModalFormData）直接传 key 字符串即可自动翻译。
 * 此模块仅用于 player.sendMessage / setActionBar 等需要 rawtext 的场景。
 */

import { Player, RawMessage } from '@minecraft/server';

export class Lang {
    /**
     * 发送翻译消息（无参数）
     */
    public static msg(player: Player, key: string): void {
        player.sendMessage({ translate: key });
    }

    /**
     * 发送翻译消息（带位置参数）
     * with 数组按顺序对应 .lang 文件中的 %1$s, %2$d, ...
     */
    public static msgF(player: Player, key: string, ...args: (string | number)[]): void {
        player.sendMessage({ rawtext: [{ translate: key, with: args.map(String) }] });
    }

    /**
     * 设置 actionbar（带 §8[VM]§r 前缀 + 颜色）
     */
    public static actionBar(player: Player, color: string, key: string, ...args: (string | number)[]): void {
        player.onScreenDisplay.setActionBar({
            rawtext: [
                { text: `§8[VM]§r ${color}` },
                args.length > 0
                    ? { translate: key, with: args.map(String) }
                    : { translate: key },
                { text: "§r" }
            ]
        });
    }

    /**
     * 创建 rawtext 翻译节点（用于 form.body 等需要 RawMessage 的场景）
     */
    public static t(key: string, ...args: (string | number)[]): RawMessage {
        return args.length > 0
            ? { translate: key, with: args.map(String) }
            : { translate: key };
    }
}