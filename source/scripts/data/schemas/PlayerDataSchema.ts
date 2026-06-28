/**
 * PlayerDataSchema.ts
 * 职责：玩家数据 schema 定义
 */

/** 玩家完整数据结构 */
export interface PlayerDataSchema {
    /** 数据版本 */
    version: number;
    /** 个人开关 */
    toggle: boolean;
    /** 个人最大连锁数 */
    maxVein: number;
    /** 个人白名单 */
    personalBlocklist: string[];
    /** 个人特殊规则覆盖 */
    specialOverride: Record<string, boolean>;
    /** 上次连锁时间戳（用于冷却） */
    lastVeinTime: number;
    /** 语言偏好 */
    lang: 'zh_CN' | 'zh_TW' | 'en_US' | undefined;
}

/** 默认玩家数据 */
export const DEFAULT_PLAYER_DATA: PlayerDataSchema = {
    version: 1,
    toggle: true,
    maxVein: 64,
    personalBlocklist: [],
    specialOverride: {},
    lastVeinTime: 0,
    lang: undefined
};
