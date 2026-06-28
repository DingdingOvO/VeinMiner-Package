/**
 * Translations.ts
 * 职责：内嵌翻译表（与 texts/*.lang 文件保持镜像同步）
 * 由 I18n.ts 调用
 */

import { Logger } from './Logger';

type LangCode = 'zh_CN' | 'zh_TW' | 'en_US';

/** 简体中文翻译表 */
const ZH_CN: Record<string, string> = {
    'veinminer.cmd.usage': '用法: /vein <子命令> [参数]',
    'veinminer.cmd.invalid': '无效的命令参数。使用 /vein 查看帮助。',
    'veinminer.cmd.onlyOp': '此命令仅管理员(OP)可用。',
    'veinminer.cmd.success': '命令执行成功。',
    'veinminer.cmd.failed': '命令执行失败。',
    'veinminer.cmd.notFound': '未找到对应的命令。',
    'veinminer.cmd.alreadyExists': '该方块已在列表中。',
    'veinminer.cmd.invalidBlock': '无效的方块ID。',
    'veinminer.cmd.invalidNumber': '无效的数字。',
    'veinminer.cmd.reloadSuccess': '配置已重新加载。',
    'veinminer.cmd.reloadFailed': '配置重新加载失败。',
    'veinminer.cmd.blacklistAdd': '已将 %s 加入全局黑名单。',
    'veinminer.cmd.blacklistRemove': '已将 %s 从全局黑名单移除。',
    'veinminer.cmd.whitelistAdd': '已将 %s 加入额外白名单。',
    'veinminer.cmd.whitelistRemove': '已将 %s 从额外白名单移除。',
    'veinminer.cmd.limitSet': '已将 %s 的连锁上限设置为 %d。',
    'veinminer.cmd.limitDefault': '已将默认连锁上限设置为 %d。',
    'veinminer.cmd.resetDone': '已重置玩家 %s 的数据。',
    'veinminer.cmd.resetAllDone': '已重置所有玩家的数据。',
    'veinminer.cmd.rateSet': '已设置全服速率限制: 每秒 %d / 每 tick %d。',
    'veinminer.cmd.envDetected': '检测到运行环境: %s',
    'veinminer.cmd.serverMode': '服务端模式 (BDS)',
    'veinminer.cmd.clientMode': '客户端模式 (单机/局域网)',
    'veinminer.cmd.cmdNotAvailable': '此命令仅服务端模式可用。',

    'veinminer.ui.title': 'VeinMiner 连锁采集',
    'veinminer.ui.toggle': '连锁开关',
    'veinminer.ui.maxBlocks': '最大连锁数',
    'veinminer.ui.reset': '重置设置',
    'veinminer.ui.whitelist': '白名单管理',
    'veinminer.ui.addBlock': '添加方块',
    'veinminer.ui.removeBlock': '移除方块',
    'veinminer.ui.status': '当前状态',
    'veinminer.ui.enabled': '已启用',
    'veinminer.ui.disabled': '已禁用',
    'veinminer.ui.on': '开',
    'veinminer.ui.off': '关',
    'veinminer.ui.mode': '运行模式',
    'veinminer.ui.universal': '通用',
    'veinminer.ui.switchMode': '切换模式',
    'veinminer.ui.reload': '重新加载配置',
    'veinminer.ui.confirm': '确认',
    'veinminer.ui.cancel': '取消',
    'veinminer.ui.back': '返回',
    'veinminer.ui.current': '当前值',
    'veinminer.ui.default': '默认',
    'veinminer.ui.global': '全局',
    'veinminer.ui.adminPanel': '管理面板',

    'veinminer.msg.toolInvalid': '此方块不在白名单中。',
    'veinminer.msg.complete': '+%d 方块',
    'veinminer.msg.enabled': '连锁采集已启用。',
    'veinminer.msg.disabled': '连锁采集已禁用。',
    'veinminer.msg.resetDone': '设置已重置。',
    'veinminer.msg.blockAdded': '已添加方块: %s',
    'veinminer.msg.blockRemoved': '已移除方块: %s',
    'veinminer.msg.alreadyInList': '该方块已在列表中。',
    'veinminer.msg.notInList': '该方块不在列表中。',
    'veinminer.msg.scanTimeout': '扫描超时，连锁已中止。',
    'veinminer.msg.blockUnloaded': '目标区块未加载，连锁已中止。',
    'veinminer.msg.limitReached': '已达到连锁上限。',
    'veinminer.msg.cooldown': '个人冷却中，请等待 %d 秒。',
    'veinminer.msg.globalCooldown': '全服冷却中，请等待 %d 秒。',
    'veinminer.msg.serverBusy': '服务器繁忙，连锁请求已拒绝。',
    'veinminer.msg.dimensionDisabled': '当前维度已禁用连锁。',
    'veinminer.msg.connected': '已连接 %d 个方块，开始采集...',
    'veinminer.msg.noPermission': '你没有权限执行此操作。',
    'veinminer.msg.envDetected': '自动检测到环境: %s',

    'veinminer.error.generic': '发生未知错误。',
    'veinminer.error.storage': '数据存储错误。',
    'veinminer.error.parsing': '数据解析错误。',
    'veinminer.error.unknown': '未知错误。',

    'veinminer.ui.server.limits': '方块上限管理',
    'veinminer.ui.server.blacklist': '黑名单管理',
    'veinminer.ui.server.whitelistExtra': '额外白名单',
    'veinminer.ui.server.dimension': '维度设置',
    'veinminer.ui.server.rateLimit': '速率限制',
    'veinminer.ui.server.playerOverride': '玩家权限',
    'veinminer.ui.server.cooldown': '冷却设置',

    'veinminer.status.enabled': '启用',
    'veinminer.status.disabled': '禁用',
    'veinminer.status.client': '客户端',
    'veinminer.status.server': '服务端',
    'veinminer.status.overworld': '主世界',
    'veinminer.status.nether': '下界',
    'veinminer.status.end': '末地'
};

/** 繁体中文翻译表 */
const ZH_TW: Record<string, string> = {
    'veinminer.cmd.usage': '用法: /vein <子命令> [參數]',
    'veinminer.cmd.invalid': '無效的命令參數。使用 /vein 查看說明。',
    'veinminer.cmd.onlyOp': '此命令僅管理員(OP)可用。',
    'veinminer.cmd.success': '命令執行成功。',
    'veinminer.cmd.failed': '命令執行失敗。',
    'veinminer.cmd.notFound': '未找到對應的命令。',
    'veinminer.cmd.alreadyExists': '該方塊已在列表中。',
    'veinminer.cmd.invalidBlock': '無效的方塊ID。',
    'veinminer.cmd.invalidNumber': '無效的數字。',
    'veinminer.cmd.reloadSuccess': '設定已重新載入。',
    'veinminer.cmd.reloadFailed': '設定重新載入失敗。',
    'veinminer.cmd.blacklistAdd': '已將 %s 加入全域黑名單。',
    'veinminer.cmd.blacklistRemove': '已將 %s 從全域黑名單移除。',
    'veinminer.cmd.whitelistAdd': '已將 %s 加入額外白名單。',
    'veinminer.cmd.whitelistRemove': '已將 %s 從額外白名單移除。',
    'veinminer.cmd.limitSet': '已將 %s 的連鎖上限設定為 %d。',
    'veinminer.cmd.limitDefault': '已將預設連鎖上限設定為 %d。',
    'veinminer.cmd.resetDone': '已重置玩家 %s 的資料。',
    'veinminer.cmd.resetAllDone': '已重置所有玩家的資料。',
    'veinminer.cmd.rateSet': '已設定全伺服速率限制: 每秒 %d / 每 tick %d。',
    'veinminer.cmd.envDetected': '偵測到執行環境: %s',
    'veinminer.cmd.serverMode': '伺服器模式 (BDS)',
    'veinminer.cmd.clientMode': '用戶端模式 (單機/區域網路)',
    'veinminer.cmd.cmdNotAvailable': '此命令僅伺服器模式可用。',

    'veinminer.ui.title': 'VeinMiner 連鎖採集',
    'veinminer.ui.toggle': '連鎖開關',
    'veinminer.ui.maxBlocks': '最大連鎖數',
    'veinminer.ui.reset': '重置設定',
    'veinminer.ui.whitelist': '白名單管理',
    'veinminer.ui.addBlock': '新增方塊',
    'veinminer.ui.removeBlock': '移除方塊',
    'veinminer.ui.status': '目前狀態',
    'veinminer.ui.enabled': '已啟用',
    'veinminer.ui.disabled': '已停用',
    'veinminer.ui.on': '開',
    'veinminer.ui.off': '關',
    'veinminer.ui.mode': '執行模式',
    'veinminer.ui.universal': '通用',
    'veinminer.ui.switchMode': '切換模式',
    'veinminer.ui.reload': '重新載入設定',
    'veinminer.ui.confirm': '確認',
    'veinminer.ui.cancel': '取消',
    'veinminer.ui.back': '返回',
    'veinminer.ui.current': '目前值',
    'veinminer.ui.default': '預設',
    'veinminer.ui.global': '全域',
    'veinminer.ui.adminPanel': '管理面板',

    'veinminer.msg.toolInvalid': '此方塊不在白名單中。',
    'veinminer.msg.complete': '+%d 方塊',
    'veinminer.msg.enabled': '連鎖採集已啟用。',
    'veinminer.msg.disabled': '連鎖採集已停用。',
    'veinminer.msg.resetDone': '設定已重置。',
    'veinminer.msg.blockAdded': '已新增方塊: %s',
    'veinminer.msg.blockRemoved': '已移除方塊: %s',
    'veinminer.msg.alreadyInList': '該方塊已在列表中。',
    'veinminer.msg.notInList': '該方塊不在列表中。',
    'veinminer.msg.scanTimeout': '掃描逾時，連鎖已中止。',
    'veinminer.msg.blockUnloaded': '目標區塊未載入，連鎖已中止。',
    'veinminer.msg.limitReached': '已達到連鎖上限。',
    'veinminer.msg.cooldown': '個人冷卻中，請等待 %d 秒。',
    'veinminer.msg.globalCooldown': '全伺服冷卻中，請等待 %d 秒。',
    'veinminer.msg.serverBusy': '伺服器忙碌，連鎖請求已拒絕。',
    'veinminer.msg.dimensionDisabled': '目前維度已停用連鎖。',
    'veinminer.msg.connected': '已連接 %d 個方塊，開始採集...',
    'veinminer.msg.noPermission': '你沒有權限執行此操作。',
    'veinminer.msg.envDetected': '自動偵測到環境: %s',

    'veinminer.error.generic': '發生未知錯誤。',
    'veinminer.error.storage': '資料儲存錯誤。',
    'veinminer.error.parsing': '資料解析錯誤。',
    'veinminer.error.unknown': '未知錯誤。',

    'veinminer.ui.server.limits': '方塊上限管理',
    'veinminer.ui.server.blacklist': '黑名單管理',
    'veinminer.ui.server.whitelistExtra': '額外白名單',
    'veinminer.ui.server.dimension': '維度設定',
    'veinminer.ui.server.rateLimit': '速率限制',
    'veinminer.ui.server.playerOverride': '玩家權限',
    'veinminer.ui.server.cooldown': '冷卻設定',

    'veinminer.status.enabled': '啟用',
    'veinminer.status.disabled': '停用',
    'veinminer.status.client': '用戶端',
    'veinminer.status.server': '伺服器',
    'veinminer.status.overworld': '主世界',
    'veinminer.status.nether': '地獄',
    'veinminer.status.end': '終界'
};

/** 英文翻译表 */
const EN_US: Record<string, string> = {
    'veinminer.cmd.usage': 'Usage: /vein <subcommand> [args]',
    'veinminer.cmd.invalid': 'Invalid command arguments. Use /vein for help.',
    'veinminer.cmd.onlyOp': 'This command is only available to operators.',
    'veinminer.cmd.success': 'Command executed successfully.',
    'veinminer.cmd.failed': 'Command execution failed.',
    'veinminer.cmd.notFound': 'Command not found.',
    'veinminer.cmd.alreadyExists': 'Block already in list.',
    'veinminer.cmd.invalidBlock': 'Invalid block ID.',
    'veinminer.cmd.invalidNumber': 'Invalid number.',
    'veinminer.cmd.reloadSuccess': 'Configuration reloaded.',
    'veinminer.cmd.reloadFailed': 'Configuration reload failed.',
    'veinminer.cmd.blacklistAdd': 'Added %s to global blacklist.',
    'veinminer.cmd.blacklistRemove': 'Removed %s from global blacklist.',
    'veinminer.cmd.whitelistAdd': 'Added %s to extra whitelist.',
    'veinminer.cmd.whitelistRemove': 'Removed %s from extra whitelist.',
    'veinminer.cmd.limitSet': 'Set vein limit for %s to %d.',
    'veinminer.cmd.limitDefault': 'Set default vein limit to %d.',
    'veinminer.cmd.resetDone': 'Reset data for player %s.',
    'veinminer.cmd.resetAllDone': 'Reset data for all players.',
    'veinminer.cmd.rateSet': 'Set global rate limit: %d/sec, %d/tick.',
    'veinminer.cmd.envDetected': 'Detected environment: %s',
    'veinminer.cmd.serverMode': 'Server mode (BDS)',
    'veinminer.cmd.clientMode': 'Client mode (Singleplayer/LAN)',
    'veinminer.cmd.cmdNotAvailable': 'This command is only available in server mode.',

    'veinminer.ui.title': 'VeinMiner',
    'veinminer.ui.toggle': 'Vein Mining Toggle',
    'veinminer.ui.maxBlocks': 'Max Blocks Per Vein',
    'veinminer.ui.reset': 'Reset Settings',
    'veinminer.ui.whitelist': 'Whitelist Management',
    'veinminer.ui.addBlock': 'Add Block',
    'veinminer.ui.removeBlock': 'Remove Block',
    'veinminer.ui.status': 'Current Status',
    'veinminer.ui.enabled': 'Enabled',
    'veinminer.ui.disabled': 'Disabled',
    'veinminer.ui.on': 'On',
    'veinminer.ui.off': 'Off',
    'veinminer.ui.mode': 'Run Mode',
    'veinminer.ui.universal': 'Universal',
    'veinminer.ui.switchMode': 'Switch Mode',
    'veinminer.ui.reload': 'Reload Config',
    'veinminer.ui.confirm': 'Confirm',
    'veinminer.ui.cancel': 'Cancel',
    'veinminer.ui.back': 'Back',
    'veinminer.ui.current': 'Current',
    'veinminer.ui.default': 'Default',
    'veinminer.ui.global': 'Global',
    'veinminer.ui.adminPanel': 'Admin Panel',

    'veinminer.msg.toolInvalid': 'Block not in whitelist.',
    'veinminer.msg.complete': '+%d blocks',
    'veinminer.msg.enabled': 'Vein mining enabled.',
    'veinminer.msg.disabled': 'Vein mining disabled.',
    'veinminer.msg.resetDone': 'Settings reset.',
    'veinminer.msg.blockAdded': 'Block added: %s',
    'veinminer.msg.blockRemoved': 'Block removed: %s',
    'veinminer.msg.alreadyInList': 'Block already in list.',
    'veinminer.msg.notInList': 'Block not in list.',
    'veinminer.msg.scanTimeout': 'Scan timeout. Vein mining aborted.',
    'veinminer.msg.blockUnloaded': 'Target chunk unloaded. Vein mining aborted.',
    'veinminer.msg.limitReached': 'Vein limit reached.',
    'veinminer.msg.cooldown': 'Personal cooldown active. Wait %d seconds.',
    'veinminer.msg.globalCooldown': 'Global cooldown active. Wait %d seconds.',
    'veinminer.msg.serverBusy': 'Server busy. Vein request rejected.',
    'veinminer.msg.dimensionDisabled': 'Vein mining disabled in this dimension.',
    'veinminer.msg.connected': 'Connected %d blocks. Mining...',
    'veinminer.msg.noPermission': 'You do not have permission for this action.',
    'veinminer.msg.envDetected': 'Auto-detected environment: %s',

    'veinminer.error.generic': 'An unknown error occurred.',
    'veinminer.error.storage': 'Data storage error.',
    'veinminer.error.parsing': 'Data parsing error.',
    'veinminer.error.unknown': 'Unknown error.',

    'veinminer.ui.server.limits': 'Block Limits',
    'veinminer.ui.server.blacklist': 'Blacklist',
    'veinminer.ui.server.whitelistExtra': 'Extra Whitelist',
    'veinminer.ui.server.dimension': 'Dimension Settings',
    'veinminer.ui.server.rateLimit': 'Rate Limit',
    'veinminer.ui.server.playerOverride': 'Player Overrides',
    'veinminer.ui.server.cooldown': 'Cooldown Settings',

    'veinminer.status.enabled': 'Enabled',
    'veinminer.status.disabled': 'Disabled',
    'veinminer.status.client': 'Client',
    'veinminer.status.server': 'Server',
    'veinminer.status.overworld': 'Overworld',
    'veinminer.status.nether': 'Nether',
    'veinminer.status.end': 'The End'
};

export class Translations {
    /** 各语言翻译表 */
    private static tables: Map<LangCode, Record<string, string>> = new Map([
        ['zh_CN', ZH_CN],
        ['zh_TW', ZH_TW],
        ['en_US', EN_US]
    ]);

    /**
     * 获取翻译
     */
    public static get(key: string, lang: LangCode): string | undefined {
        const table = this.tables.get(lang);
        return table?.[key];
    }

    /**
     * 校验所有翻译表（启动时调用）
     */
    public static validate(): { size: number; keys: number } {
        let totalKeys = 0;
        for (const [lang, table] of this.tables) {
            const keys = Object.keys(table).length;
            totalKeys += keys;
            Logger.debug(`翻译表 ${lang}: ${keys} 键`);
        }
        return { size: this.tables.size, keys: totalKeys / this.tables.size | 0 };
    }
}
