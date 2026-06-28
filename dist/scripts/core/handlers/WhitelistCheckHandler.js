/**
 * WhitelistCheckHandler.ts
 * 职责：检查方块是否在有效白名单中
 */
import { BlockFilter } from '../../lib/core/BlockFilter';
export class WhitelistCheckHandler {
    check(block, player, registry) {
        const result = BlockFilter.check(block, player, registry);
        return result.allowed;
    }
}
