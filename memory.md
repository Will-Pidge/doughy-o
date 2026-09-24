# Doughy-O — memory

## 2026-09-24 — Look refresh: font + background options produced, awaiting a pick
- Will and Lara want two visual changes: (1) a different font for the DOUGHY-O name at the top,
  (2) replace the black + pink-dot background with a faint old-school comic wallpaper in brand
  colours (Doughy as the main character, a few POW/BANG/SPLAT bursts, no story, no speech bubbles)
  under a light grey semi-transparent wash so it's barely visible.
- Options page published as a Claude artifact: https://claude.ai/artifact/PBFmuc1EeWDKg72NYiHtRh
  Nine fonts (F1 Bangers = current, F2 Luckiest Guy, F3 Bowlby One, F4 Titan One, F5 Chewy,
  F6 Sigmar One, F7 Bungee Shade, F8 Modak, F9 Bagel Fat One) and five backgrounds (B0 current,
  B1 grey wash, B2 paper wash, B3 pink wash, B4 night wash) with a wash-strength slider.
  Source of the page: scratchpad only; the wallpaper is an inline SVG tile built in JS, so it can
  be lifted straight into the app once chosen.
- Nothing in the app changed yet. Next: Will sends back a code like "F3 + B1, wash 86%", then
  update index.html (font link), style.css (.logo + body background) and bump the sw.js cache.
- No Notion task exists for Doughy-O yet (searched personal Tasks + Projects, 24 Sep). Proposed:
  project "Doughy-O", task "Look refresh: title font + comic wallpaper", personal tier.

## 2026-09-21 (later still) — Auto-deploy confirmed; two follow-ups on the Notion board
- **Pushing to `main` updates the live site.** Verified end to end: pushed a commit, Cloudflare
  built it automatically, the new file appeared at doughy.willpidge.com.
- **Correction:** the "Manually deployed" label was only describing the FIRST deployment (the one
  uploaded when the project was created), not a broken setting. Git auto-deploy was already working.
  Diagnosed it wrongly at first because the Deployments page showed an empty "Recent builds" section
  that simply hadn't loaded. Check the **build history** page, not the deployments summary.
- Added `wrangler.jsonc` anyway — states the deploy config explicitly (`assets.directory: "./"`,
  no build step) instead of relying on Cloudflare inferring it. Not the fix, but worth keeping.
- Build config, for reference: repo `Will-Pidge/doughy-o`, production branch `main`,
  deploy command `npx wrangler deploy`, no build command.
- Two follow-ups now live as tasks in **Tasks (Pidge)**, both due Fri 25 Sep 2026:
  DMARC record for willpidge.com, and the registration transfer off WordPress.
- Next: Fire tablet — Silk → Add to Home Screen.

## 2026-09-21 (later) — LIVE at doughy.willpidge.com
- Deployed via Cloudflare. Note: Cloudflare's current flow creates a **Worker** (static assets),
  not a Pages project — URL is `doughy-o.will-2c2.workers.dev`. Pages is being folded into Workers.
- Custom domain added under: Workers & Pages → doughy-o → **Domains** tab → + Add Domain.
  Cloudflare created the DNS record itself and issued the cert (both zone + worker on Cloudflare).
- The `*.willpidge.com` wildcard does NOT interfere — the specific `doughy` record wins.
- **Gotcha for next time:** local DNS cached the old wildcard answer for ages, so the site looked
  dead from this Mac while working fine everywhere else. Check with
  `dig @kallie.ns.cloudflare.com <host>` or `dig @1.1.1.1 <host>` before assuming it's broken.
- Verified live: all files 200, valid cert, service worker **active**, manifest + 4 icons, no console errors.
- **Open loose end:** project lists as "Manually deployed" — pushing to GitHub may not auto-update
  the live site. Sort before adding puzzles, or changes won't appear.
- Next: Fire tablet — Silk → Add to Home Screen. Then auto-deploy, then DMARC on the domain.

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
