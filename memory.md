# Doughy-O — memory

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
