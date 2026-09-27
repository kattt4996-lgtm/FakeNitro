# FakeNitro
By Icarozz — fork of FakeProfileThemesAndEffects, extended with client-side Nitro cosmetic bypasses ported from YABDP4Nitro (BetterDiscord).

Allows profile theming and the usage of profile effects by hiding the colors and effect ID in your About Me using invisible, zero-width characters, plus optional local unlocks for emojis, stickers, and premium type display.

> https://kattt4996-lgtm.github.io/FakeNitro/FakeNitro

## Building & deploying

1. `pnpm install`
2. `pnpm build` — outputs to `dist/FakeNitro/` (manifest.json + index.js)
3. Push to GitHub, then run the "Build and deploy" Action (Actions tab → workflow_dispatch), or push `dist/` to a `gh-pages` branch manually.
4. Enable GitHub Pages for the repo (Settings → Pages → source: `gh-pages` branch).
5. In Revenge/Bunny: Settings → Plugins → Install plugin → paste
   `https://kattt4996-lgtm.github.io/FakeNitro/FakeNitro/`
