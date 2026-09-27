import { find } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

import { safeFindFunction, safeToString } from "@lib/safeScan";

function looksLikeStickerSendability(fn: unknown): fn is (...args: any[]) => unknown {
    const src = safeToString(fn);
    if (!src) return false;
    return src.includes("canUseCustomStickersEverywhere")
        || src.includes("SENDABLE_WITH_BOOSTED_GUILD");
}

export const patchUnlockStickers = () => {
    const mod = find(m => !!safeFindFunction(m, looksLikeStickerSendability));
    if (!mod) return () => true;

    const hit = safeFindFunction(mod, looksLikeStickerSendability);
    if (!hit) return () => true;

    return instead(mod, hit.key, (args: unknown[], orig: (...a: any[]) => unknown) => {
        if (!storage.unlockStickers) return orig(...args);
        return 0; // SENDABLE
    });
};
