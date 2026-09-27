import { find } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

/**
 * Ported from YABDP4Nitro (BetterDiscord) to Revenge.
 *
 * BD used getMangled() with a bySource() filter to locate the sticker
 * sendability checker by matching on the function's stringified source.
 * Revenge's `find` supports the same kind of predicate-based lookup, so we
 * replicate it by scanning exported functions for the same source markers.
 */

function looksLikeStickerSendability(fn: unknown): fn is (...args: any[]) => unknown {
    if (typeof fn !== "function") return false;
    const src = fn.toString();
    return src.includes("canUseCustomStickersEverywhere") || src.includes("SENDABLE_WITH_BOOSTED_GUILD");
}

export const patchUnlockStickers = () => {
    const mod = find(m => {
        if (!m || typeof m !== "object") return false;
        return Object.values(m).some(looksLikeStickerSendability);
    }) as Record<string, any> | undefined;

    if (!mod) return () => true;

    const key = Object.keys(mod).find(k => looksLikeStickerSendability(mod[k]));
    if (!key) return () => true;

    return instead(key, mod, (args: unknown[], orig: (...a: any[]) => unknown) => {
        if (!storage.unlockStickers) return orig(...args);
        // 0 == StickerSendability.SENDABLE in Discord's enum
        return 0;
    });
};
