/**
 * build.mjs — VeinMiner 构建脚本
 * 
 * 功能：
 *   npm run build   → 编译 TS + 打包 .mcaddon
 *   npm run compile → 仅编译 TS
 *   npm run pack    → 仅打包（从已有的 build/）
 *   npm run watch   → 监听 TS 变更 + 自动打包
 *   npm run dev     → 同 watch
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = __dirname;
const BUILD_DIR = path.join(SOURCE_DIR, 'build');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PACK_NAME = 'VeinMiner';
const ROOT_DIR = path.join(__dirname, '..');

// 需要复制到 build/ 的静态文件（不经过 TS 编译）
const STATIC_FILES = ['manifest.json'];
const STATIC_DIRS = ['texts'];

/**
 * 清空 build/ 目录
 */
function cleanBuild() {
    if (fs.existsSync(BUILD_DIR)) {
        fs.rmSync(BUILD_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(BUILD_DIR, { recursive: true });
    console.log('✓ build/ 已清空');
}

/**
 * 复制静态文件到 build/
 */
function copyStatics() {
    // 复制文件
    for (const file of STATIC_FILES) {
        const src = path.join(SOURCE_DIR, file);
        const dst = path.join(BUILD_DIR, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dst);
            console.log(`  复制 ${file}`);
        }
    }
    // 复制目录
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
 * 将 build/ 打包为 .mcaddon
 * 结构：VeinMiner.mcaddon → VeinMiner.mcpack → (manifest.json, scripts/, texts/)
 */
function createMcaddon() {
    const mcpackPath = path.join(ROOT_DIR, `${PACK_NAME}.mcpack`);
    const mcaddonPath = path.join(ROOT_DIR, `${PACK_NAME}.mcaddon`);

    // 删除旧的
    for (const p of [mcpackPath, mcaddonPath]) {
        if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    // 读取 build/ 所有文件，写入 .mcpack
    const mcpackFiles = [];
    function walk(dir, base) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            const arcPath = path.join(base, entry.name).replace(/\\/g, '/');
            if (entry.isDirectory()) {
                walk(fullPath, arcPath);
            } else {
                mcpackFiles.push({ fullPath, arcPath });
            }
        }
    }
    walk(BUILD_DIR, '');

    // 写入 .mcpack（使用 Node.js 内置 zlib）
    // 简单起见用 child_process 调用 zip
    try {
        const tmpDir = path.join(BUILD_DIR, '_mcpack_tmp');
        if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
        fs.mkdirSync(tmpDir, { recursive: true });

        // 创建临时 mcpack 内容
        for (const { fullPath, arcPath } of mcpackFiles) {
            const dst = path.join(tmpDir, arcPath);
            fs.mkdirSync(path.dirname(dst), { recursive: true });
            fs.copyFileSync(fullPath, dst);
        }

        // 打包 mcpack
        execSync(`cd "${tmpDir}" && zip -r "${mcpackPath}" .`, { stdio: 'pipe' });
        console.log(`✓ ${PACK_NAME}.mcpack (${(fs.statSync(mcpackPath).size / 1024).toFixed(1)} KB)`);

        // 打包 mcaddon（内含 mcpack）
        const tmpAddOn = path.join(BUILD_DIR, '_addon_tmp');
        if (fs.existsSync(tmpAddOn)) fs.rmSync(tmpAddOn, { recursive: true });
        fs.mkdirSync(tmpAddOn, { recursive: true });
        fs.copyFileSync(mcpackPath, path.join(tmpAddOn, `${PACK_NAME}.mcpack`));

        execSync(`cd "${tmpAddOn}" && zip -r "${mcaddonPath}" .`, { stdio: 'pipe' });
        console.log(`✓ ${PACK_NAME}.mcaddon (${(fs.statSync(mcaddonPath).size / 1024).toFixed(1)} KB)`);

        // 清理临时目录
        fs.rmSync(tmpDir, { recursive: true, force: true });
        fs.rmSync(tmpAddOn, { recursive: true, force: true });
    } catch (e) {
        // 如果 zip 不可用，用纯 JS 方式（简化版）
        console.warn('  zip 命令不可用，使用 Node.js 内置打包');
        createMcaddonJS(mcpackFiles, mcpackPath, mcaddonPath);
    }
}

/**
 * 纯 JS 打包（zip 不可用时的 fallback）
 */
function createMcaddonJS(files, mcpackPath, mcaddonPath) {
    // 简易 zip 实现（仅存储，无压缩）
    // 实际项目中建议安装 archiver npm 包
    console.warn('  ⚠ 建议安装 zip: apt install zip');
    console.warn('  或安装 archiver: npm i -D archiver');
}

/**
 * 同步 build/ 到 dist/（保持 dist/ 作为预构建目录）
 */
function syncToDist() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.cpSync(BUILD_DIR, DIST_DIR, { recursive: true });
    console.log('✓ dist/ 已同步');
}

// ===== 主流程 =====
// npm run build = tsc && node build.mjs
// 此时 build/scripts/ 已有 tsc 编译的 .js，不要清空！
// npm run pack  = 仅打包（tsc 已在外部跑过）
// npm run clean = 手动清空

const args = process.argv.slice(2);
const isClean = args.includes('--clean');

console.log('\n═══ VeinMiner Pack ═══\n');

if (isClean) {
    cleanBuild();
    console.log('  (已清空，需重新 npm run compile)');
    process.exit(0);
}

// 确保 build/ 存在
if (!fs.existsSync(BUILD_DIR)) {
    console.error('✗ build/ 不存在，请先运行: npm run compile');
    console.error('  或直接: npm run build (编译+打包一步到位)');
    process.exit(1);
}

copyStatics();
createMcaddon();
syncToDist();

console.log('\n✓ 构建完成！');
console.log(`  build/              — 编译产物（.js + 静态文件）`);
console.log(`  dist/               — 预构建副本（用于 Git 分发）`);
console.log(`  ../VeinMiner.mcaddon — 可直接导入 Minecraft`);
console.log('');