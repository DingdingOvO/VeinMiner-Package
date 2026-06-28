/**
 * WhitelistItemRenderer.ts
 * 职责：渲染白名单条目
 */
export class WhitelistItemRenderer {
    static render(_player, blockId) {
        return `§7- ${blockId}§r`;
    }
    static renderList(_player, list) {
        if (list.length === 0)
            return '§7默认§r';
        return list.map(id => `§7- ${id}§r`).join('\n');
    }
}
