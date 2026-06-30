/**
 * I18n.ts
 * 职责：国际化文本管理，根据玩家语言偏好返回对应翻译
 * 支持简体中文(zh_CN)、繁体中文(zh_TW)、英文(en_US)
 *
 * 注意：texts/*.lang 文件由 Minecraft 引擎自动加载（用于原生 UI），
 * 脚本中通过 Translations.ts 内嵌的镜像表来实现 t() 翻译。
 */

import { Player } from '@minecraft/server';
import { Logger } from './Logger';
import { Translations } from './Translations';

/** 支持的语言 */
export type LangCode = 'zh_CN' | 'zh_TW' | 'en_US';

export class I18n {
    /** 默认语言 */
    private static defaultLang: LangCode = 'zh_CN';

    /** 初始化（启动时调用一次） */
    public static init(): void {
        try {
            const counts = Translations.validate();
            Logger.info(`I18n 已加载 ${counts.size} 种语言，共 ${counts.keys} 个键`);
        } catch (err) {
            Logger.error('I18n 初始化失败', err);
        }
    }

    /**
     * 翻译文本
     * @param key 翻译键
     * @param lang 语言代码
     * @param args 替换参数（%s 字符串、%d 数字）
     */
    public static t(key: string, lang: LangCode = this.defaultLang, ...args: unknown[]): string {
        let text = Translations.get(key, lang) ?? key;

        // 替换 %s 与 %d
        let strIdx = 0;
        text = text.replace(/%[sd]/g, (match) => {
            if (strIdx >= args.length) return match;
            const val = args[strIdx++];
            return match === '%d' ? String(Math.floor(Number(val) || 0)) : String(val);
        });
        return text;
    }

    /**
     * 根据玩家获取翻译文本
     * @param player 玩家（自动检测语言）
     */
    public static for(player: Player, key: string, ...args: unknown[]): string {
        const lang = this.detectPlayerLang(player);
        return this.t(key, lang, ...args);
    }

    /**
     * 检测玩家语言（基于玩家偏好存储，无则默认）
     */
    public static detectPlayerLang(player: Player): LangCode {
        try {
            const pref = player.getDynamicProperty('veinminer:lang') as string | undefined;
            if (pref === 'zh_CN' || pref === 'zh_TW' || pref === 'en_US') {
                return pref;
            }
        } catch {
            // 忽略
        }
        return this.defaultLang;
    }

    /**
     * 设置玩家语言偏好
     */
    public static setPlayerLang(player: Player, lang: LangCode): void {
        try {
            player.setDynamicProperty('veinminer:lang', lang);
        } catch (err) {
            Logger.error('设置玩家语言失败', err);
        }
    }

    /** 设置默认语言 */
    public static setDefaultLang(lang: LangCode): void {
        this.defaultLang = lang;
    }
}
