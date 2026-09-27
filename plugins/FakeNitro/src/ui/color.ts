import { find, findByProps } from "@vendetta/metro";
import { semanticColors as _semanticColors } from "@vendetta/ui";
import type { ComponentType, PropsWithChildren } from "react";

import type { EmptyObject } from "@lib/utils";

export const semanticColors: Record<string, EmptyObject> = _semanticColors;

const _resolveSemanticColor: ((theme: Theme, semanticColor: EmptyObject) => string) | undefined
    = find(m => m.default?.internal?.resolveSemanticColor)?.default.internal.resolveSemanticColor
    ?? find(m => m.meta?.resolveSemanticColor)?.meta.resolveSemanticColor;

// Guard against a missing/undefined theme (e.g. useThemeContext failed to
// resolve after a Discord update) so we don't crash the whole screen when
// the underlying resolver does Object.keys()/spread on `theme`.
export const resolveSemanticColor: (theme: Theme | undefined, semanticColor: EmptyObject) => string | undefined
    = (theme, semanticColor) => {
        if (!theme || !semanticColor || !_resolveSemanticColor) return undefined;
        try {
            return _resolveSemanticColor(theme, semanticColor);
        } catch (err) {
            console.error("[FPTE] resolveSemanticColor failed", err);
            return undefined;
        }
    };

export const useAvatarColors: (
    avatarUrl: string,
    fillerColor: string,
    desaturateColors?: boolean | undefined /* = true */
) => string[]
    = (findByProps("useAvatarColors") as Record<string, any> | undefined)?.useAvatarColors
    ?? (() => undefined);

export type Theme = "dark" | "light" | "midnight" | "darker";

export const getProfileTheme: <T extends number | null | undefined>(primaryColor: T) => T extends number ? Theme : null
    = findByProps("getProfileTheme").getProfileTheme;

export interface ThemeContext {
    theme: Theme;
    primaryColor: number | null;
    secondaryColor: number | null;
    gradient: {
        id: number;
        theme: Theme;
        colors: {
            stop: number;
            token: string;
        }[];
        angle: number;
        midpointPercentage: number;
        getName: () => string;
    } | null;
    flags: number;
    key: string;
}

// Fall back to a sane default theme instead of `{}` so consumers that
// destructure `theme` (and pass it straight into resolveSemanticColor)
// don't end up passing `undefined` around when this lookup fails.
export const useThemeContext: () => ThemeContext
    = (findByProps("useThemeContext") as Record<string, any> | undefined)?.useThemeContext
    ?? (() => ({
        theme: "dark",
        primaryColor: null,
        secondaryColor: null,
        gradient: null,
        flags: 0,
        key: "fallback",
    }));

export type ThemeContextProviderProps = PropsWithChildren<Partial<ThemeContext>>;

export const ThemeContextProvider: ComponentType<ThemeContextProviderProps>
    = (findByProps("ThemeContextProvider") as Record<string, any> | undefined)?.ThemeContextProvider
    ?? (({ children }) => children);
