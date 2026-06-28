/**
 * ActionFormFactory.ts
 * 职责：ActionForm 创建工厂
 * UI 表单文本直接传翻译 key，游戏引擎自动根据玩家语言翻译
 */

import { ActionFormData } from '@minecraft/server-ui';
import { Player } from '@minecraft/server';

export class ActionFormFactory {
    public static create(_player: Player, titleKey: string, bodyKey?: string): ActionFormData {
        const form = new ActionFormData();
        form.title(titleKey);
        if (bodyKey) {
            form.body(bodyKey);
        }
        return form;
    }
}