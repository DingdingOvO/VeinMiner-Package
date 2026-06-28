# VeinMiner 服务端管理手册

> 面向服主（BDS 管理员）的部署与配置指南

## 适用场景

本说明适用于 **Bedrock Dedicated Server (BDS)** 专用服务器环境。

> 如果你在玩单机或局域网，请参阅 [README_Client.md](./README_Client.md)

## 服务端模式详解

### 环境自动检测
VeinMiner 启动时会自动检测 `@minecraft/server-admin` 模块。BDS 中此模块可用，因此自动进入服务端模式。

### 服务端模式特点
- ✅ 服主统一管理所有配置
- ✅ 普通玩家受权限控制
- ✅ 黑名单、方块上限、速率限制、维度限制均生效
- ✅ 配置持久化（存储在 world DynamicProperty）
- ❌ 普通玩家无法修改个人白名单/上限（除非服主允许）
- ❌ 普通玩家无法绕过黑名单

## 部署步骤

### 1. 安装行为包
```bash
# 复制到 BDS 行为包目录
cp -r VeinMiner /path/to/bds/behavior_packs/
```

### 2. 启用行为包
编辑 `worlds/<世界名>/world_behavior_packs.json`：
```json
[
    {
        "pack_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        "version": [1, 0, 0]
    }
]
```

### 3. 启用测试版 API
编辑 `worlds/<世界名>/world.json`，添加：
```json
{
    "experiments": ["data_driven_items", "scripting_api", "script_eval"]
}
```

或在 `server.properties` 中：
```properties
allow-outbound-script-debugging=true
```

### 4. 启动服务器
启动 BDS，控制台应输出：
```
[VeinMiner] [INFO] 环境检测: 服务端模式 (BDS)
[VeinMiner] [INFO] VeinMiner 启动完成 ✓
```

## 管理命令参考

### 黑名单管理
```
/vein blacklist add <方块ID>      # 添加到全局黑名单
/vein blacklist remove <方块ID>   # 从全局黑名单移除
/vein blacklist list              # 查看全局黑名单
```

**示例**：
```
/vein blacklist add minecraft:spawner
/vein blacklist remove minecraft:obsidian
```

### 额外白名单
默认白名单 + 额外白名单 = 完整白名单

```
/vein whitelist add <方块ID>      # 添加到额外白名单
/vein whitelist remove <方块ID>   # 从额外白名单移除
/vein whitelist list              # 查看额外白名单
```

**示例**（添加模组方块）：
```
/vein whitelist add mymod:custom_ore
```

### 方块上限
```
/vein limit <方块ID> <数量>       # 设置特定方块上限
/vein limit default <数量>        # 设置默认上限
/vein limit list                  # 查看所有上限
```

**示例**：
```
/vein limit minecraft:diamond_ore 32
/vein limit default 64
```

### 速率限制
```
/vein rate <每秒数量> <每tick数量>
```

**示例**：
```
/vein rate 256 4
```

### 配置管理
```
/vein reload                      # 重新加载配置
/vein reset <玩家名>              # 重置指定玩家数据
/vein reset all                   # 重置所有玩家数据
```

### 管理面板
输入 `/vein` 打开可视化管理面板，包含：
- 方块上限管理
- 黑名单管理
- 额外白名单
- 维度设置
- 速率限制
- 玩家权限
- 冷却设置

## 玩家权限控制

通过修改 `scripts/config/server/player_override/` 下的默认值控制玩家权限：

| 配置项 | 说明 | 默认 |
|--------|------|------|
| `AllowPlayerToggle` | 允许玩家切换开关 | `true` |
| `AllowPlayerMaxVein` | 允许玩家调整最大连锁数 | `false` |
| `AllowPlayerWhitelist` | 允许玩家管理个人白名单 | `false` |

修改后需执行 `/vein reload` 或重启服务器。

## 维度配置

通过修改 `scripts/config/server/dimension/` 下的默认值控制各维度：

| 维度 | 默认启用 | 默认倍率 |
|------|----------|----------|
| 主世界 | ✅ | 1.0 |
| 下界 | ✅ | 0.8 |
| 末地 | ✅ | 0.5 |

倍率作用于最大连锁数：
- 主世界 64 上限 → 64 个方块
- 下界 64 上限 × 0.8 → 51 个方块
- 末地 64 上限 × 0.5 → 32 个方块

## 冷却配置

通过修改 `scripts/config/server/scheduled/` 控制冷却：

| 配置项 | 说明 | 默认 |
|--------|------|------|
| `CooldownSeconds` | 玩家个人冷却（秒） | 0 |
| `GlobalCooldownSeconds` | 全服冷却（秒） | 0 |

## 配置持久化

所有 OP 修改的配置存储在 world 级 DynamicProperty 中：
- 键名：`veinminer:server_config`
- 格式：JSON 字符串
- 位置：`worlds/<世界名>/db/`（LevelDB）

**备份建议**：定期备份 `worlds/<世界名>/db/` 目录。

## 性能优化建议

### 1. 调整性能参数
修改 `scripts/config/shared/performance/`：

| 参数 | 默认 | 建议（高负载） |
|------|------|---------------|
| `MAX_VEIN_DEFAULT` | 64 | 32 |
| `BLOCKS_PER_TICK` | 1 | 1（保持） |
| `SCAN_TIMEOUT_MS` | 100 | 50 |
| `TPS_THRESHOLD` | 15 | 18 |
| `MAX_CONCURRENT_TASKS` | 8 | 4 |

### 2. 服务端速率限制
推荐配置：
- 小型服务器（10 人以下）：256/秒，4/tick
- 中型服务器（10-30 人）：128/秒，2/tick
- 大型服务器（30+ 人）：64/秒，1/tick

### 3. 方块上限策略
- 矿石：32-48（防止囤积）
- 原木：64（一次砍树）
- 石头：32（避免大规模破坏）

### 4. 黑名单建议
建议添加：
- `minecraft:bedrock`（防破坏基岩）
- `minecraft:obsidian`（防滥用）
- `minecraft:command_block`（防破坏命令方块）
- `minecraft:structure_void`
- `minecraft:barrier`
- `minecraft:spawner`（防刷怪笼被连锁破坏）

## 监控与日志

### 查看日志
BDS 控制台会输出 VeinMiner 日志：
```
[VeinMiner] [INFO] ...
[VeinMiner] [WARN] ...
[VeinMiner] [ERROR] ...
```

### 调试模式
修改 `scripts/utils/Logger.ts`：
```typescript
private static level: LogLevel = LogLevel.DEBUG;
```

### 性能监控
执行 `/vein status` 可查看：
- 当前 TPS
- 活跃任务数
- 每秒破坏方块数
- 是否过载

## 常见问题

### Q1: 服务端模式未生效？
**A**: 
1. 确认使用的是 BDS（不是客户端对局域网开放）
2. 检查控制台是否输出"服务端模式 (BDS)"
3. 确认 `@minecraft/server-admin` 模块已加载

### Q2: 普通玩家无法使用 `/vein toggle`？
**A**: 检查 `AllowPlayerToggle` 配置是否为 `true`。

### Q3: 配置修改后不生效？
**A**: 执行 `/vein reload`，或重启服务器。

### Q4: 如何重置所有配置为默认？
**A**: 
1. 停止服务器
2. 删除 world 中的 `veinminer:server_config` 属性
3. 重启服务器

或使用脚本：
```javascript
world.setDynamicProperty('veinminer:server_config', undefined);
```

### Q5: 玩家数据如何清理？
**A**: 
- 单个玩家：`/vein reset <玩家名>`
- 所有玩家：`/vein reset all`

### Q6: 如何禁止某个维度使用连锁？
**A**: 修改 `scripts/config/server/dimension/XxxEnabled.ts` 为 `false`，重新编译并 `/vein reload`。

### Q7: 如何限制某玩家不能使用连锁？
**A**: VeinMiner 目前不直接支持玩家级开关控制，可通过设置 `AllowPlayerToggle=false` 禁用所有玩家的开关能力。

### Q8: 如何查看当前配置？
**A**: OP 执行 `/vein` 打开管理面板，或使用对应的 `/vein xxx list` 命令。

## 升级指南

### 从 1.0.x 升级到 1.1.x
1. 备份 `worlds/<世界名>/db/` 目录
2. 备份现有 VeinMiner 文件夹
3. 替换为新版本
4. 重新编译：`npm run build`
5. 启动服务器，DataMigrator 会自动迁移数据

### 数据迁移
VeinMiner 内置数据迁移机制（`DataMigrator.ts`），升级时自动执行。如遇迁移失败，请检查控制台日志。

## 联系与支持

如有问题或建议，请提交 issue 或联系开发者。
