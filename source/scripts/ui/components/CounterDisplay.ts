/**
 * CounterDisplay.ts
 * 职责：计数显示组件
 */

export class CounterDisplay {
    public static render(label: string, current: number, max: number): string {
        const ratio = max > 0 ? current / max : 0;
        const bar = this.progressBar(ratio);
        return `§7${label}: §e${current}/${max}§r ${bar}`;
    }

    public static progressBar(ratio: number, length: number = 10): string {
        const filled = Math.round(ratio * length);
        return `§a${'■'.repeat(filled)}§r§8${'■'.repeat(length - filled)}§r`;
    }
}
