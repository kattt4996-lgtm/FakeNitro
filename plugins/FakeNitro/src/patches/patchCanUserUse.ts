import { find } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

/**
 * Ported from YABDP4Nitro (BetterDiscord) to Revenge.
 *
 * Discord gates a bunch of client-rendered-only features (emoji everywhere,
 * animated emoji, custom client themes, etc.) behind a generic
 * `canUserUse(feature, user)` check that reads `feature.getFeatureValue(...)`
 * plus a premium check. We intercept it and force `true` for the specific
 * feature names the user has opted into via settings, and defer to the
 * original implementation otherwise.
 */

// Maps Discord internal feature-flag names to our storage toggle keys.
const BYPASS_MAP: Record<string, keyof typeof storage> = {
    emojisEverywhere: "unlockEmojis",
    animatedEmojis: "unlockEmojis",
    soundboardEverywhere: "unlockEmojis"
};

function looksLikeCanUserUse(fn: unknown): fn is (...args: any[]) => unknown {
    if (typeof fn !== "function") return false;
    const src = fn.toString();
    return src.includes(".getFeatureValue(") && src.includes("isPremium");
}

export const patchCanUserUse = () => {
    const mod = find(m => {
        if (!m || typeof m !== "object") return false;
        return Object.values(m).some(looksLikeCanUserUse);
    }) as Record<string, any> | undefined;

    if (!mod) return () => true;

    const key = Object.keys(mod).find(k => looksLikeCanUserUse(mod[k]));
    if (!key) return () => true;

    return instead(key, mod, (args: unknown[], orig: (...a: any[]) => unknown) => {
        const [feature, user] = args as [{ name?: string } | undefined, unknown];
        const settingKey = feature?.name ? BYPASS_MAP[feature.name] : undefined;
        if (settingKey && storage[settingKey]) return true;
        return orig(feature, user);
    });
};
