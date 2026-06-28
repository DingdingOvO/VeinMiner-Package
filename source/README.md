# VeinMiner 连锁采集行为包

> 自动环境适配的 Minecraft 基岩版连锁采集行为包

## 项目简介

VeinMiner 是一个**单一通用包**，能够自动检测运行环境（客户端/服务端），无需手动切换模式即可在不同环境下正确运行。

- **客户端模式**（单机/局域网）：所有玩家拥有完整的个人配置能力
- **服务端模式**（BDS 专用服务器）：由服主统一管理所有配置，普通玩家受权限控制

## 核心特性

### 环境自动适配
通过检测 `@minecraft/server-admin` 模块是否可用来自动判断运行环境：
- 模块可用 → 服务端模式（BDS）
- 模块不可用 → 客户端模式（单机/局域网）

### 配置分离
- `config/shared/` - 共享配置（所有环境通用）
- `config/client/` - 客户端专用配置（个人白名单、上限、开关）
- `config/server/` - 服务端专用配置（黑名单、方块上限、速率限制、维度限制）

### 多语言支持
- 简体中文（zh_CN）
- 繁体中文（zh_TW）
- 英文（en_US）

## 目录结构

```
VeinMiner/
├── manifest.json              # 行为包清单
├── pack_icon.png              # 行为包图标
├── texts/                     # 语言文件
│   ├── zh_CN.lang
│   ├── zh_TW.lang
│   └── en_US.lang
├── scripts/                   # TypeScript 源码
│   ├── main.ts                # 入口文件
│   ├── lib/                   # 核心库
│   ├── utils/                 # 工具（含 EnvironmentDetector）
│   ├── commands/              # 命令系统
│   ├── config/                # 配置层
│   │   ├── shared/            # 共享配置
│   │   ├── client/            # 客户端配置
│   │   ├── server/            # 服务端配置
│   │   └── registry/          # 配置注册中心
│   ├── core/                  # 业务逻辑
│   │   ├── controller/        # 控制器
│   │   └── handlers/          # 处理器
│   ├── ui/                    # UI 层
│   │   ├── factory/           # UI 工厂
│   │   ├── menus/             # 主菜单
│   │   ├── personal/          # 个人 UI
│   │   ├── server/            # 服务端管理 UI
│   │   └── components/        # UI 组件
│   └── data/                  # 数据层
│       ├── storage/           # 存储适配器
│       └── schemas/           # 数据结构定义
├── package.json
├── tsconfig.json
├── README.md                  # 本文档
├── README_Client.md           # 客户端专用说明
└── README_Server.md           # 服务端专用说明
```

## 安装与部署

### 1. 安装依赖
```bash
npm install
```

### 2. 编译 TypeScript
```bash
npm run build
```

编译后的 JavaScript 文件会输出到 `scripts/` 目录（与 .ts 同目录，由 tsconfig.json 的 `outDir` 控制）。

### 3. 部署到游戏

#### Windows
将整个 VeinMiner 文件夹复制到：
```
%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\
```

#### BDS
将文件夹复制到：
```
<服务器根目录>/behavior_packs/
```

并在 `worlds/<世界名>/world_behavior_packs.json` 中添加引用。

### 4. 启用行为包
1. 进入游戏
2. 创建或进入世界
3. 在世界设置中启用"实验性 API"（测试版 API）
4. 启用 VeinMiner 行为包

## 环境检测原理

VeinMiner 通过以下顺序检测运行环境：

1. **主要方法**：尝试 `require('@minecraft/server-admin')`
   - 该模块仅在专用服务器（BDS）中可用
   - 加载成功 → 服务端模式
   - 加载失败 → 继续尝试其他方法

2. **备选方法**：检测 `system.server` 属性
   - 部分版本暴露此属性用于标识服务器环境

3. **默认**：客户端模式

检测结果在启动时缓存，避免重复检测开销。

## 命令列表

所有命令均以 `/vein` 开头。

| 命令 | 权限 | 适用环境 | 说明 |
|------|------|----------|------|
| `/vein` | 所有玩家 | 全部 | 打开主菜单 |
| `/vein toggle` | 所有玩家 | 全部 | 切换连锁开关 |
| `/vein status` | 所有玩家 | 全部 | 查看当前状态 |
| `/vein blacklist add <方块ID>` | OP | 服务端 | 添加到全局黑名单 |
| `/vein blacklist remove <方块ID>` | OP | 服务端 | 从全局黑名单移除 |
| `/vein blacklist list` | OP | 服务端 | 查看全局黑名单 |
| `/vein whitelist add <方块ID>` | OP | 服务端 | 添加到额外白名单 |
| `/vein whitelist remove <方块ID>` | OP | 服务端 | 从额外白名单移除 |
| `/vein whitelist list` | OP | 服务端 | 查看额外白名单 |
| `/vein limit <方块ID> <数量>` | OP | 服务端 | 设置方块上限 |
| `/vein limit default <数量>` | OP | 服务端 | 设置默认上限 |
| `/vein limit list` | OP | 服务端 | 查看所有上限 |
| `/vein rate <每秒> <每tick>` | OP | 服务端 | 设置全服速率限制 |
| `/vein reload` | OP | 全部 | 重新加载配置 |
| `/vein reset <玩家名>` | OP | 全部 | 重置指定玩家数据 |
| `/vein reset all` | OP | 全部 | 重置所有玩家数据 |

> 客户端模式下，服务端相关命令会提示"此命令仅服务端模式可用"。

## 快速开始

### 客户端模式（单机/局域网）

1. 进入世界
2. 潜行 + 使用镐/斧/锹挖矿
3. 输入 `/vein` 打开主菜单调整设置
4. 输入 `/vein toggle` 快速开关

### 服务端模式（BDS）

1. 服主使用 `/vein` 打开管理面板
2. 配置黑名单、方块上限、维度限制等
3. 普通玩家可使用 `/vein toggle` 切换开关（若服主允许）
4. 普通玩家使用 `/vein status` 查看状态

## 测试方法

### 基础功能测试（20 项）

1. ✅ 进入世界，控制台输出"环境检测"日志
2. ✅ 输入 `/vein` 显示主菜单
3. ✅ 输入 `/vein status` 显示状态
4. ✅ 输入 `/vein toggle` 切换开关
5. ✅ 潜行挖煤矿触发连锁
6. ✅ 潜行挖铁矿触发连锁
7. ✅ 潜行挖钻石矿触发连锁
8. ✅ 潜行砍橡木触发连锁
9. ✅ 不潜行挖矿不触发连锁
10. ✅ 徒手挖矿不触发连锁
11. ✅ 工具耐久不足时停止连锁
12. ✅ 连锁数量达到上限时停止
13. ✅ 跨区块边界时正常工作
14. ✅ 维度切换后正常工作
15. ✅ 客户端模式可调整个人白名单
16. ✅ 客户端模式可调整最大连锁数
17. ✅ 服务端模式 OP 可访问管理面板
18. ✅ 服务端模式普通玩家受权限限制
19. ✅ 服务端模式黑名单生效
20. ✅ 服务端模式速率限制生效

### 高级测试（10 项）

21. ✅ 时运附魔生效（增加掉落）
22. ✅ 精准采集附魔生效
23. ✅ 耐久附魔减少耐久消耗
24. ✅ TPS 低于阈值时拒绝新请求
25. ✅ 并发任务数限制生效
26. ✅ 维度倍率正确应用
27. ✅ `/vein reload` 即时生效
28. ✅ `/vein reset <玩家>` 清除数据
29. ✅ 多语言切换正确
30. ✅ 服务器重启后配置持久化

## 维护指南

### 修改默认配置

- **共享白名单**：编辑 `scripts/config/shared/whitelist/*.ts`
- **工具映射**：编辑 `scripts/config/shared/toolmapping/*.ts`
- **性能参数**：编辑 `scripts/config/shared/performance/*.ts`
- **特殊规则**：编辑 `scripts/config/shared/specialrules/*.ts`
- **服务端默认黑名单**：编辑 `scripts/config/server/blacklist/*.ts`
- **服务端默认方块上限**：编辑 `scripts/config/server/blocklimits/*.ts`

### 添加新方块

1. 在对应的白名单文件中添加方块ID
2. 重新编译：`npm run build`
3. 在游戏中执行 `/vein reload`

### 调试日志

修改 `scripts/utils/Logger.ts` 中的 `LogLevel`：
- `DEBUG` - 详细日志（用于开发）
- `INFO` - 一般信息（默认）
- `WARN` - 仅警告
- `ERROR` - 仅错误

## 常见问题（FAQ）

### Q1: 行为包加载失败？
**A**: 检查 `manifest.json` 中的 `min_engine_version` 是否匹配游戏版本，确保启用了"测试版 API"。

### Q2: 命令无响应？
**A**: 确保使用 `/vein`（带斜杠），而非 `vein`。检查控制台是否有错误日志。

### Q3: 连锁不触发？
**A**: 必须满足以下条件：
- 玩家处于潜行状态
- 手持镐/斧/锹（任一）
- 目标方块在白名单中
- 个人开关已开启

### Q4: 服务端模式识别错误？
**A**: 确保使用的是 BDS（专用服务器），而非客户端的"对局域网开放"功能。

### Q5: 服务器卡顿？
**A**: 调整 `scripts/config/shared/performance/` 下的参数：
- 降低 `MAX_VEIN_DEFAULT`
- 降低 `BLOCKS_PER_TICK`
- 提高 `TPS_THRESHOLD`

### Q6: 如何添加模组方块？
**A**: 服务端模式使用 `/vein whitelist add <模组方块ID>`，客户端模式在主菜单中添加。

### Q7: 配置不保存？
**A**: 检查 world 是否有写入 DynamicProperty 的权限。BDS 需要确认 `server.properties` 中的相关设置。

### Q8: 多语言切换？
**A**: 玩家可通过 `/vein lang <语言代码>` 切换（如有实现），或修改 `I18n.ts` 中的默认语言。

### Q9: 重置所有玩家数据？
**A**: OP 执行 `/vein reset all`。

### Q10: 如何禁用某些方块的连锁？
**A**: 
- 服务端模式：`/vein blacklist add <方块ID>`
- 客户端模式：从 `scripts/config/shared/whitelist/` 对应文件中移除

## 技术规格

- **最低引擎版本**：1.21.100
- **依赖模块**：`@minecraft/server` 1.16.0-beta, `@minecraft/server-ui` 1.3.0-beta
- **TypeScript**：5.6+
- **目标**：ES2022
- **严格模式**：全部启用

## 许可证

MIT License
