/**
 * commands/index.ts
 * 职责：命令系统统一导出 + 注册所有命令
 */

import { CommandRegistry } from './CommandRegistry';
import { CommandBase, CommandContext, CommandMeta } from './CommandBase';
import { VeinCommand } from './VeinCommand';
import { VeinToggleCommand } from './VeinToggleCommand';
import { VeinStatusCommand } from './VeinStatusCommand';
import { VeinBlacklistCommand } from './VeinBlacklistCommand';
import { VeinWhitelistCommand } from './VeinWhitelistCommand';
import { VeinLimitCommand } from './VeinLimitCommand';
import { VeinReloadCommand } from './VeinReloadCommand';
import { VeinResetCommand } from './VeinResetCommand';
import { VeinRateCommand } from './VeinRateCommand';

export {
    CommandRegistry,
    CommandBase,
    CommandContext,
    CommandMeta,
    VeinCommand,
    VeinToggleCommand,
    VeinStatusCommand,
    VeinBlacklistCommand,
    VeinWhitelistCommand,
    VeinLimitCommand,
    VeinReloadCommand,
    VeinResetCommand,
    VeinRateCommand
};

/**
 * 注册所有命令（启动时调用）
 */
export function registerAllCommands(): void {
    CommandRegistry.registerAll([
        new VeinCommand(),
        new VeinToggleCommand(),
        new VeinStatusCommand(),
        new VeinBlacklistCommand(),
        new VeinWhitelistCommand(),
        new VeinLimitCommand(),
        new VeinReloadCommand(),
        new VeinResetCommand(),
        new VeinRateCommand()
    ]);
}
