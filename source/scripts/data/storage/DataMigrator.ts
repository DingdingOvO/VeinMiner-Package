/**
 * DataMigrator.ts
 * 职责：数据版本迁移
 * 当数据结构升级时，将旧版本数据迁移到新版本
 */

import { world } from '@minecraft/server';
import { Logger } from '../../utils/Logger';

const VERSION_KEY = 'veinminer:data_version';
const CURRENT_VERSION = 1;

export class DataMigrator {
    /**
     * 执行迁移（启动时调用）
     */
    public static migrate(): void {
        try {
            const current = world.getDynamicProperty(VERSION_KEY) as number | undefined;
            if (current === undefined) {
                // 首次安装
                world.setDynamicProperty(VERSION_KEY, CURRENT_VERSION);
                Logger.info(`首次安装，数据版本: ${CURRENT_VERSION}`);
                return;
            }
            if (current < CURRENT_VERSION) {
                Logger.info(`开始数据迁移: ${current} → ${CURRENT_VERSION}`);
                // 后续版本升级时在此添加迁移逻辑
                world.setDynamicProperty(VERSION_KEY, CURRENT_VERSION);
                Logger.info('数据迁移完成');
            }
        } catch (err) {
            Logger.error('数据迁移失败', err);
        }
    }

    /**
     * 获取当前数据版本
     */
    public static getVersion(): number {
        return world.getDynamicProperty(VERSION_KEY) as number ?? 0;
    }
}
