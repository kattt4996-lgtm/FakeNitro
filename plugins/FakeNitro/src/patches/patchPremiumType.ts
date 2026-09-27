import { findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

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

    const methodName = CANDIDATE_METHOD_NAMES.find(name => {
        try {
            return typeof store[name] === "function";
        } catch {
            return false;
        }
    });
    if (!methodName) return () => true;

    return instead(store, methodName, (args: unknown[], orig: (...a: any[]) => unknown) => {
        const override = storage.premiumTypeOverride;
        if (override === undefined || override === -1) return orig(...args);
        return override;
    });
};
