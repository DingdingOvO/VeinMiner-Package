/**
 * build.mjs — VeinMiner 构建脚本（纯行为包）
 *
 * 流程：tsc 编译 → 复制静态文件 → zip 成 .mcaddon
 * .mcaddon 就是行为包文件的直接 zip，不嵌套
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = __dirname;
const BUILD_DIR = path.join(SOURCE_DIR, 'build');
const OUTPUT_DIR = path.join(__dirname, '..', 'upload');

// 需要复制到 build/ 的静态文件（不经过 TS 编译）
const STATIC_FILES = ['manifest.json', 'pack_icon.png'];

// ═══════════════════════════════════════
//  复制静态文件
// ═══════════════════════════════════════

function copyStatics() {
    for (const file of STATIC_FILES) {
        const src = path.join(SOURCE_DIR, file);
        const dst = path.join(BUILD_DIR, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dst);
            console.log(`  复制 ${file}`);
        }
    }
}

// ═══════════════════════════════════════
//  打包 .mcaddon（纯行为包，直接 zip）
// ═══════════════════════════════════════

function createMcaddon() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const version = process.env.PACK_VERSION || 'v0.1.0-alpha';
    const fileName = `VeinMiner-${version}.mcaddon`;
    const outputPath = path.join(OUTPUT_DIR, fileName);

    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    // 直接把 build/ 内容 zip 成 .mcaddon（不嵌套）
    execSync(`cd "${BUILD_DIR}" && zip -r "${outputPath}" .`, { stdio: 'pipe' });

    const size = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(`  ✓ ${fileName} (${size} KB)`);
}

// ═══════════════════════════════════════
//  主流程
// ═══════════════════════════════════════

const args = process.argv.slice(2);

if (args.includes('--clean')) {
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    }
    console.log('  ✓ build/ 已清空');
    process.exit(0);
}

console.log('\n═══ VeinMiner Build (行为包) ═══\n');

// 检查 build/ 是否存在（需要先 tsc 编译）
if (!fs.existsSync(BUILD_DIR)) {
    console.error('  ✗ build/ 不存在，请先运行: npm run build');
    process.exit(1);
}

copyStatics();
createMcaddon();

console.log('\n  ✓ 构建完成！');