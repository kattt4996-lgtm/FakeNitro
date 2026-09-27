import { find } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

import { safeFindFunction, safeToString } from "@lib/safeScan";

const BYPASS_MAP: Record<string, keyof typeof storage> = {
    emojisEverywhere: "unlockEmojis",
    animatedEmojis: "unlockEmojis",
    soundboardEverywhere: "unlockEmojis"
};

function looksLikeCanUserUse(fn: unknown): fn is (...args: any[]) => unknown {
    const src = safeToString(fn);
    if (!src) return false;
    return src.includes(".getFeatureValue(") && src.includes("isPremium");
}

export const patchCanUserUse = () => {
    const mod = find(m => !!safeFindFunction(m, looksLikeCanUserUse));
    if (!mod) return () => true;

    const hit = safeFindFunction(mod, looksLikeCanUserUse);
    if (!hit) return () => true;

    return instead(mod, hit.key, (args: unknown[], orig: (...a: any[]) => unknown) => {
        const [feature, user] = args as [{ name?: string } | undefined, unknown];
        const settingKey = feature?.name ? BYPASS_MAP[feature.name] : undefined;
        if (settingKey && storage[settingKey]) return true;
        return orig(feature, user);
    });
};
