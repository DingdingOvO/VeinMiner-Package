/**
 * build.mjs — VeinMiner 构建脚本（纯行为包）
 *
 * 输出 VeinMiner.mcaddon
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = __dirname;
const BUILD_DIR = path.join(SOURCE_DIR, 'build');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const ROOT_DIR = path.join(__dirname, '..');
const PACK_NAME = 'VeinMiner';

// 需要复制到 build/ 的静态文件（不经过 TS 编译）
const STATIC_FILES = ['manifest.json'];
const STATIC_DIRS = ['texts'];

/**
 * 复制静态文件到 build/
 */
function copyStatics() {
    for (const file of STATIC_FILES) {
        const src = path.join(SOURCE_DIR, file);
        const dst = path.join(BUILD_DIR, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dst);
            console.log(`  复制 ${file}`);
        }
    }
    for (const dir of STATIC_DIRS) {
        const src = path.join(SOURCE_DIR, dir);
        const dst = path.join(BUILD_DIR, dir);
        if (fs.existsSync(src)) {
            fs.cpSync(src, dst, { recursive: true });
            console.log(`  复制 ${dir}/`);
        }
    }
}

/**
 * 打包 .mcaddon
 */
function createMcaddon() {
    const mcaddonPath = path.join(ROOT_DIR, `${PACK_NAME}.mcaddon`);
    if (fs.existsSync(mcaddonPath)) fs.unlinkSync(mcaddonPath);

    execSync(`cd "${BUILD_DIR}" && zip -r "${mcaddonPath}" .`, { stdio: 'pipe' });
    const size = (fs.statSync(mcaddonPath).size / 1024).toFixed(1);
    console.log(`  ✓ ${PACK_NAME}.mcaddon (${size} KB)`);
}

/**
 * 同步到 dist/
 */
function syncToDist() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.cpSync(BUILD_DIR, DIST_DIR, { recursive: true });
    console.log('  ✓ dist/ 已同步');
}

// ===== 主流程 =====
const args = process.argv.slice(2);
const isClean = args.includes('--clean');

console.log('\n═══ VeinMiner Build (行为包) ═══\n');

if (isClean) {
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    }
    console.log('  ✓ build/ 已清空');
    process.exit(0);
}

if (!fs.existsSync(BUILD_DIR)) {
    console.error('  ✗ build/ 不存在，请先运行: npm run compile');
    console.error('    或直接: npm run build');
    process.exit(1);
}

copyStatics();
createMcaddon();
syncToDist();

console.log('\n  ✓ 构建完成！');
console.log(`    dist/                    — 预构建文件`);
console.log(`    ../VeinMiner.mcaddon      — 行为包，可直接导入 Minecraft`);
console.log('');