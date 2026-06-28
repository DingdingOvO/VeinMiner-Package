/**
 * CounterDisplay.ts
 * 职责：计数显示组件
 */
export class CounterDisplay {
    static render(label, current, max) {
        const ratio = max > 0 ? current / max : 0;
        const bar = this.progressBar(ratio);
        return `§7${label}: §e${current}/${max}§r ${bar}`;
    }
    static progressBar(ratio, length = 10) {
        const filled = Math.round(ratio * length);
        return `§a${'■'.repeat(filled)}§r§8${'■'.repeat(length - filled)}§r`;
    }
}
