/**
 * BedrockBlacklist.ts
 * 职责：基岩黑名单
 */

export const BEDROCK_BLACKLIST = ['minecraft:bedrock'] as const;

export function getBedrockBlacklist(): string[] {
    return [...BEDROCK_BLACKLIST];
}
