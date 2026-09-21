# Doughy-O — memory

## 2026-09-21 — Split into its own repo, prepped for hosting
- Doughy-O now lives in its own **public** repo: `Will-Pidge/doughy-o`. Files stayed at
  `~/projects/other/doughy-o`; the `other-projects` repo untracks it via `.gitignore`.
- Trimmed daughter's age from CLAUDE.md before going public. Design notes otherwise published as-is.
- **Icon gap closed:** added `icon-192.png` / `icon-512.png` rendered from `icon.svg` (via macOS
  `qlmanage`), wired into manifest + apple-touch-icon. Service worker cache bumped v1 → v2.
- Added `.claude/launch.json` so the local preview server starts with one command.
- **Hosting plan:** Cloudflare Pages → `doughy.willpidge.com`. Not GitHub Pages as originally
  planned (private repo would have needed a paid plan).
- Domain context: `willpidge.com` DNS moved from WordPress.com to Cloudflare on 21 Sep, so the
  subdomain can be added inside Cloudflare directly. The WordPress site is private/empty; free
  plan won't serve a custom domain at all, which is why the root currently redirects.
- Next: Will connects the repo to Cloudflare Pages, adds the custom domain, then test on the
  Fire tablet via Silk → Add to Home Screen.

## 2026-09-14 (later) — Practice mode added
- Will wanted to keep going after the daily puzzle. Added "MORE RIDDLES" / "MORE MATHS" buttons
  (home + summary). Practice puzzles use the same per-subject difficulty, so they get harder as you
  get them right. Points count to all-time score; streak is daily-only.
- Puzzle tag now shows the level ("RIDDLE · LVL 3"). Bank grown to 60 riddles, 55 maths, 25 jokes.
- Rule confirmed: one DAILY puzzle for the streak, unlimited practice on top.

## 2026-09-14 — Phase 1 prototype built and tested
- Built the playable web app: home → riddle → maths → joke → summary. Clues, forgiving spelling,
  points, streak, levels, sounds (drumroll / ta-da / gentle bonk) all working in the browser.
- Starter bank: 30 riddles, 25 maths, 25 jokes in `puzzles.json`.
- Doughy is a placeholder SVG (`doughy.svg`); daughter to draw the real one.
- Known gaps: iPhone home-screen icon needs a PNG (SVG ignored by iOS); not yet hosted online,
  so it only runs from the Mac for now. Next: put it on GitHub Pages so it can go on a phone.
- To play locally: `python3 -m http.server 8080` in the folder, open http://localhost:8080.

## 2026-09-14 — Project kicked off
- Interviewed Will + daughter; decisions captured in CLAUDE.md.
- Name chosen: **Doughy-O**. Wrong-answer sound: gentle bonk (daughter's call).
- Tech decision: simple web app (PWA) first, wrap later. No Xcode needed.
- Lives as a subfolder of the `other-projects` repo (not its own repo yet; may split out for GitHub Pages).
- Next: Phase 1 prototype, then play it together and note what to change.
