import { findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

/**
 * Ported from YABDP4Nitro (BetterDiscord) to Revenge.
 *
 * Overrides the *locally rendered* premium type (0 = none, 1 = Nitro
 * Classic, 2 = Nitro, 3 = Nitro Basic) so your own client shows Nitro-gated
 * UI/features as unlocked. This is purely cosmetic/local: it does not touch
 * what other users or Discord's servers see about your account.
 *
 * storage.premiumTypeOverride: -1 (disabled) | 0 | 1 | 2 | 3
 */

const CANDIDATE_STORE_NAMES = [
    "OverridePremiumTypeStore",
    "PremiumStore"
];

function findPremiumStore(): Record<string, any> | undefined {
    for (const name of CANDIDATE_STORE_NAMES) {
        const store = findByStoreName(name) as Record<string, any> | undefined;
        if (store) return store;
    }
    return undefined;
}

const CANDIDATE_METHOD_NAMES = [
    "getPremiumTypeActual",
    "getPremiumType"
];

export const patchPremiumType = () => {
    const store = findPremiumStore();
    if (!store) return () => true;

    const methodName = CANDIDATE_METHOD_NAMES.find(name => typeof store[name] === "function");
    if (!methodName) return () => true;

    return instead(methodName, store, (args: unknown[], orig: (...a: any[]) => unknown) => {
        const override = storage.premiumTypeOverride;
        if (override === undefined || override === -1) return orig(...args);
        return override;
    });
};
