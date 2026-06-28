/**
 * WhitelistItemRenderer.ts
 * 职责：渲染白名单条目
 */


export class WhitelistItemRenderer {
    public static render(_player: unknown, blockId: string): string {
        return `§7- ${blockId}§r`;
    }

    public static renderList(_player: unknown, list: string[]): string {
        if (list.length === 0) return '§7默认§r';
        return list.map(id => `§7- ${id}§r`).join('\n');
    }
}
