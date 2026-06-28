/**
 * ObsidianRule.ts
 * 职责：黑曜石特殊规则
 * 默认不允许黑曜石连锁（消耗过大）
 */
export const OBSIDIAN_RULE = {
    enabled: false,
    /** 即使启用，单次最大数量 */
    maxBlocks: 4,
    /** 必须使用钻石/下界合金镐 */
    requireMinTier: 'diamond'
};
export function getObsidianRule() {
    return OBSIDIAN_RULE;
}
