/**
 * ObsidianBlacklist.ts
 * 职责：黑曜石黑名单（默认禁止连锁）
 */
export const OBSIDIAN_BLACKLIST = ['minecraft:obsidian', 'minecraft:crying_obsidian'];
export function getObsidianBlacklist() {
    return [...OBSIDIAN_BLACKLIST];
}
