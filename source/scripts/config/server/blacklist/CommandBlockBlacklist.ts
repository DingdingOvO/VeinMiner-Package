/**
 * CommandBlockBlacklist.ts
 * 职责：命令方块黑名单
 */

export const COMMAND_BLOCK_BLACKLIST = [
    'minecraft:command_block',
    'minecraft:repeating_command_block',
    'minecraft:chain_command_block'
] as const;

export function getCommandBlockBlacklist(): string[] {
    return [...COMMAND_BLOCK_BLACKLIST];
}
