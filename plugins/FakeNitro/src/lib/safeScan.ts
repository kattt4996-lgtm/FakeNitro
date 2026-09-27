export function safeGet(mod: any, key: string): { ok: boolean; value?: any } {
    try {
        return { ok: true, value: mod[key] };
    } catch {
        return { ok: false };
    }
}

export function safeKeys(mod: any): string[] {
    try {
        return Object.keys(mod);
    } catch {
        return [];
    }
}

export function safeFindFunction(
    mod: any,
    predicate: (fn: unknown) => boolean,
): { key: string; value: any } | undefined {
    if (!mod || typeof mod !== "object") return undefined;
    for (const k of safeKeys(mod)) {
        const r = safeGet(mod, k);
        if (r.ok && predicate(r.value)) return { key: k, value: r.value };
    }
    return undefined;
}

export function safeToString(fn: unknown): string | null {
    if (typeof fn !== "function") return null;
    try {
        return fn.toString();
    } catch {
        return null;
    }
}
