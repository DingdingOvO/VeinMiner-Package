/**
 * blacklist/index.ts
 */

export * from './BedrockBlacklist';
export * from './ObsidianBlacklist';
export * from './CommandBlockBlacklist';
export * from './StructureVoidBlacklist';
export * from './BarrierBlacklist';

import { BEDROCK_BLACKLIST } from './BedrockBlacklist';
import { OBSIDIAN_BLACKLIST } from './ObsidianBlacklist';
import { COMMAND_BLOCK_BLACKLIST } from './CommandBlockBlacklist';
import { STRUCTURE_VOID_BLACKLIST } from './StructureVoidBlacklist';
import { BARRIER_BLACKLIST } from './BarrierBlacklist';

/** 默认黑名单（合并） */
export const DEFAULT_BLACKLIST: string[] = [
    ...BEDROCK_BLACKLIST,
    ...OBSIDIAN_BLACKLIST,
    ...COMMAND_BLOCK_BLACKLIST,
    ...STRUCTURE_VOID_BLACKLIST,
    ...BARRIER_BLACKLIST
];
