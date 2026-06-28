# VeinMiner 连锁采集行为包

## 目录说明

- **source/** — 源代码（仅 .ts 文件，需自行编译）
- **dist/** — 成品（含编译好的 .js，可直接部署）

## 使用方法

### 部署到 Minecraft（用 dist/）
1. 将 `dist/` 目录内所有文件复制到 `development_behavior_packs/VeinMiner/`
2. 进入世界设置，启用"测试版 API"
3. 启用 VeinMiner 行为包

### 发布到 GitHub（用 source/）
1. 将 `source/` 目录内所有文件上传到 GitHub 仓库
2. 或本地 `git init && git push`

### 自行编译源代码
```bash
cd source
npm install
npm run build
# 编译后的 .js 会生成在 source/scripts/ 下
```

## 兼容性
- 最低引擎版本：1.21.100
- 依赖：@minecraft/server 2.2.0-beta, @minecraft/server-ui 2.1.0-beta
