import { findByProps } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

/**
 * Ported from YABDP4Nitro (BetterDiscord) to Revenge.
 * Patches the emoji gating functions so locked/filtered/premium/disabled
 * emojis are treated as always usable, purely on the client's own render
 * and send-eligibility checks.
 */

const EMOJI_LOCK_KEYS = [
    "isEmojiFilteredOrLocked",
    "isEmojiDisabled",
    "isEmojiFiltered",
    "isEmojiPremiumLocked"
] as const;

export const patchUnlockEmojis = () => {
    const emojiUtils = findByProps(...EMOJI_LOCK_KEYS) as Record<string, any> | undefined;
    if (!emojiUtils) return () => true;

    const unpatches: (() => void)[] = [];

    for (const key of EMOJI_LOCK_KEYS) {
        if (typeof emojiUtils[key] !== "function") continue;
        unpatches.push(
            instead(key, emojiUtils, (args: unknown[], orig: (...a: any[]) => unknown) => {
                if (!storage.unlockEmojis) return orig(...args);
                return false;
            })
        );
    }

    if (typeof emojiUtils.getEmojiUnavailableReason === "function") {
        unpatches.push(
            instead("getEmojiUnavailableReason", emojiUtils, (args: unknown[], orig: (...a: any[]) => unknown) => {
                if (!storage.unlockEmojis) return orig(...args);
                return undefined;
            })
        );
    }

    return () => unpatches.forEach(unpatch => unpatch());
};
