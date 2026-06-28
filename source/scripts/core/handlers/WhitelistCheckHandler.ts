/**
 * WhitelistCheckHandler.ts
 * 职责：检查方块是否在有效白名单中
 */

import { Block, Player } from '@minecraft/server';
import { ConfigRegistry } from '../../config/registry/ConfigRegistry';
import { BlockFilter } from '../../lib/core/BlockFilter';

export class WhitelistCheckHandler {
    public check(block: Block, player: Player, registry: ConfigRegistry): boolean {
        const result = BlockFilter.check(block, player, registry);
        return result.allowed;
    }
}
