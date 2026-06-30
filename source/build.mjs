/**
 * build.mjs — VeinMiner 构建脚本（纯行为包）
 *
 * 流程：esbuild 打包单文件 → 复制静态文件 → zip 成 .mcpack → 再套 .mcaddon
 *
 * 为什么用 esbuild 而不是 tsc 多文件：
 *   Minecraft 脚本引擎不支持 Node 风格的 index.js 隐式解析，
 *   多文件模块导入（import from './core'）会报 "Import not found"。
 *   esbuild 打包成单个 main.js 彻底避免此问题。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { build as esbuild } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = __dirname;
const BUILD_DIR = path.join(SOURCE_DIR, 'build');
const BUILD_SCRIPTS_DIR = path.join(BUILD_DIR, 'scripts');
const OUTPUT_DIR = path.join(__dirname, '..', 'upload');

// 需要复制到 build/ 的静态文件（不经过编译）
const STATIC_FILES = ['manifest.json', 'pack_icon.png'];

const ENTRY = path.join(SOURCE_DIR, 'scripts', 'main.ts');

// ═══════════════════════════════════════
//  esbuild 打包
// ═══════════════════════════════════════

async function bundleWithEsbuild() {
    console.log('  esbuild 打包中...');

    if (fs.existsSync(BUILD_SCRIPTS_DIR)) {
        fs.rmSync(BUILD_SCRIPTS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(BUILD_SCRIPTS_DIR, { recursive: true });

    await esbuild({
        entryPoints: [ENTRY],
        bundle: true,
        outfile: path.join(BUILD_SCRIPTS_DIR, 'main.js'),
        format: 'esm',
        target: 'es2022',
        platform: 'neutral',
        minify: false,
        sourcemap: false,
        external: ['@minecraft/server', '@minecraft/server-ui'],
        // 保留注释用于调试
        legalComments: 'inline',
    });

    const size = (fs.statSync(path.join(BUILD_SCRIPTS_DIR, 'main.js')).size / 1024).toFixed(1);
    console.log(`  ✓ main.js (${size} KB)`);
}

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
//  打包：build/ → .mcpack → .mcaddon
// ═══════════════════════════════════════

function createPackages() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const version = process.env.PACK_VERSION || 'v0.1.0-alpha';
    const mcpackName = `VeinMiner-${version}.mcpack`;
    const mcaddonName = `VeinMiner-${version}.mcaddon`;
    const mcpackPath = path.join(OUTPUT_DIR, mcpackName);
    const mcaddonPath = path.join(OUTPUT_DIR, mcaddonName);

    // 清理旧文件
    if (fs.existsSync(mcpackPath)) fs.unlinkSync(mcpackPath);
    if (fs.existsSync(mcaddonPath)) fs.unlinkSync(mcaddonPath);

    // 1. build/ 内容 zip 成 .mcpack
    execSync(`cd "${BUILD_DIR}" && zip -r "${mcpackPath}" .`, { stdio: 'pipe' });
    const mcpackSize = (fs.statSync(mcpackPath).size / 1024).toFixed(1);
    console.log(`  ✓ ${mcpackName} (${mcpackSize} KB)`);

    // 2. .mcpack 套进 .mcaddon
    execSync(`cd "${OUTPUT_DIR}" && zip "${mcaddonPath}" "${mcpackName}"`, { stdio: 'pipe' });
    const mcaddonSize = (fs.statSync(mcaddonPath).size / 1024).toFixed(1);
    console.log(`  ✓ ${mcaddonName} (${mcaddonSize} KB)`);

    // 3. 删除中间 .mcpack（.mcaddon 才是最终产物）
    fs.unlinkSync(mcpackPath);
    console.log(`  清理中间文件 ${mcpackName}`);
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

bundleWithEsbuild();
copyStatics();
createPackages();

console.log('\n  ✓ 构建完成！');