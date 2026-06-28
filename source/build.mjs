/**
 * build.mjs — VeinMiner 构建脚本（双包架构）
 *
 * 输出 VeinMiner.mcaddon（内含行为包 .mcpack + 资源包 .mcpack）
 * 行为包：build/ → VeinMiner_BP/
 * 资源包：resource_pack/ → VeinMiner_RP/
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = __dirname;
const BUILD_DIR = path.join(SOURCE_DIR, 'build');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const RESOURCE_PACK_DIR = path.join(__dirname, '..', 'resource_pack');
const ROOT_DIR = path.join(__dirname, '..');
const PACK_NAME = 'VeinMiner';
const BP_FOLDER = 'VeinMiner_BP';
const RP_FOLDER = 'VeinMiner_RP';

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
 * 打包双包 .mcaddon
 *
 * .mcaddon 结构（zip）:
 *   VeinMiner_BP.mcpack   （行为包 zip）
 *   VeinMiner_RP.mcpack   （资源包 zip）
 */
function createMcaddon() {
    const mcaddonPath = path.join(ROOT_DIR, `${PACK_NAME}.mcaddon`);
    if (fs.existsSync(mcaddonPath)) fs.unlinkSync(mcaddonPath);

    const tmpDir = path.join(BUILD_DIR, '_pkg_tmp');
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
    fs.mkdirSync(tmpDir, { recursive: true });

    // --- 行为包 .mcpack ---
    const bpTmpDir = path.join(tmpDir, BP_FOLDER);
    fs.mkdirSync(bpTmpDir, { recursive: true });
    // 复制 build/ 内容（manifest + scripts + texts）
    for (const entry of fs.readdirSync(BUILD_DIR, { withFileTypes: true })) {
        if (entry.name.startsWith('_')) continue; // 跳过临时目录
        const src = path.join(BUILD_DIR, entry.name);
        const dst = path.join(bpTmpDir, entry.name);
        if (entry.isDirectory()) {
            fs.cpSync(src, dst, { recursive: true });
        } else {
            fs.copyFileSync(src, dst);
        }
    }
    const bpMcpack = path.join(tmpDir, `${BP_FOLDER}.mcpack`);
    execSync(`cd "${bpTmpDir}" && zip -r "${bpMcpack}" .`, { stdio: 'pipe' });
    const bpSize = (fs.statSync(bpMcpack).size / 1024).toFixed(1);
    console.log(`  ✓ ${BP_FOLDER}.mcpack (${bpSize} KB)`);

    // --- 资源包 .mcpack ---
    const rpMcpack = path.join(tmpDir, `${RP_FOLDER}.mcpack`);
    execSync(`cd "${RESOURCE_PACK_DIR}" && zip -r "${rpMcpack}" .`, { stdio: 'pipe' });
    const rpSize = (fs.statSync(rpMcpack).size / 1024).toFixed(1);
    console.log(`  ✓ ${RP_FOLDER}.mcpack (${rpSize} KB)`);

    // --- 打包 .mcaddon（内含两个 .mcpack） ---
    execSync(`cd "${tmpDir}" && zip -r "${mcaddonPath}" "${BP_FOLDER}.mcpack" "${RP_FOLDER}.mcpack"`, { stdio: 'pipe' });
    const addonSize = (fs.statSync(mcaddonPath).size / 1024).toFixed(1);
    console.log(`  ✓ ${PACK_NAME}.mcaddon (${addonSize} KB)`);

    // 清理临时目录
    fs.rmSync(tmpDir, { recursive: true, force: true });
}

/**
 * 同步到 dist/（行为包部分，用于 Git 分发）
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

console.log('\n═══ VeinMiner Pack (双包架构) ═══\n');

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

if (!fs.existsSync(RESOURCE_PACK_DIR)) {
    console.error('  ✗ resource_pack/ 不存在');
    process.exit(1);
}

copyStatics();
createMcaddon();
syncToDist();

console.log('\n  ✓ 构建完成！');
console.log(`    dist/                 — 行为包预构建`);
console.log(`    ../VeinMiner.mcaddon  — 双包（BP+RP），可直接导入 Minecraft`);
console.log('');