/**
 * whitelist/index.ts
 * 职责：共享白名单统一导出
 */
export * from './OreWhitelist';
export * from './LogWhitelist';
export * from './StoneWhitelist';
export * from './ExtraWhitelist';
import { ORE_WHITELIST } from './OreWhitelist';
import { LOG_WHITELIST } from './LogWhitelist';
import { STONE_WHITELIST } from './StoneWhitelist';
import { EXTRA_WHITELIST } from './ExtraWhitelist';
/** 合并所有共享白名单 */
export function getAllSharedWhitelist() {
    return [...ORE_WHITELIST, ...LOG_WHITELIST, ...STONE_WHITELIST, ...EXTRA_WHITELIST];
}
