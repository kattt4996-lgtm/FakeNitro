import { findByProps } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

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
        let isFn = false;
        try {
            isFn = typeof emojiUtils[key] === "function";
        } catch {
            isFn = false;
        }
        if (!isFn) continue;

        unpatches.push(
            instead(emojiUtils, key, (args: unknown[], orig: (...a: any[]) => unknown) => {
                if (!storage.unlockEmojis) return orig(...args);
                return false;
            })
        );
    }

    let hasGetReason = false;
    try {
        hasGetReason = typeof emojiUtils.getEmojiUnavailableReason === "function";
    } catch {
        hasGetReason = false;
    }

    if (hasGetReason) {
        unpatches.push(
            instead(emojiUtils, "getEmojiUnavailableReason", (args: unknown[], orig: (...a: any[]) => unknown) => {
                if (!storage.unlockEmojis) return orig(...args);
                return undefined;
            })
        );
    }

    return () => unpatches.forEach(unpatch => unpatch());
};
