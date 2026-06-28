/**
 * ui/index.ts
 * 职责：UI 设置统一导出
 */
export * from './MenuTitle';
export * from './ButtonOrder';
export * from './SliderMin';
export * from './SliderMax';
export * from './SliderDefault';
import { MENU_TITLE } from './MenuTitle';
import { BUTTON_ORDER } from './ButtonOrder';
import { SLIDER_MIN } from './SliderMin';
import { SLIDER_MAX } from './SliderMax';
import { SLIDER_DEFAULT } from './SliderDefault';
/** UI 配置聚合 */
export const UI_CONFIG = {
    title: MENU_TITLE,
    buttonOrder: BUTTON_ORDER,
    sliderMin: SLIDER_MIN,
    sliderMax: SLIDER_MAX,
    sliderDefault: SLIDER_DEFAULT
};
