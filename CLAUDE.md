> **Start here, every time:** read this file and `memory.md` before doing anything.

# Doughy-O — a daily riddle app built by Will and his daughter

A comic-style (Beano / Phoenix) daily brain game starring **Doughy**, a medium-sized pink
dinosaur with green spikes. Every day you get a riddle, then a maths puzzle, then a joke.
Build a streak, climb levels, protect your personal best.

## Who it's for
Will (learning to code, explain things in plain English) and his daughter.
Kid-friendly first. Fun over clever.

## Core rules (decided 14 Sep 2026)
- **Daily flow:** riddle → maths puzzle → joke (the joke is the reward, drumroll first).
- **One DAILY session per day** for the streak. **Practice mode** (More Riddles / More Maths) is unlimited,
  climbs in difficulty as you get them right, adds to all-time points, never touches the streak.
- **Typed answers** with forgiving spelling: each puzzle lists 5–6 accepted spellings, plus a
  fuzzy match (within 2 letters for longer answers, stricter for short ones).
- **Clues:** up to 3 per puzzle. Points: 3 with no clue, 2 with one, 1 with two or three, 0 if wrong.
- **Streak:** +1 per day the riddle is right. Wrong answer OR missed day resets to 0.
- **Levels:** climb by keeping a streak. Breaking a streak drops you ONE level, never more.
  Ladder: Egg → Hatchling → Riddle Rookie → Brain Splatter → Puzzle Pro → Spike Master → Doughy Legend
- **Difficulty adapts per subject** (riddles / maths / literacy tracked separately):
  right = up a notch, wrong = stay or drop slightly.
- **Sounds:** drumroll before answer reveal, big "ta-da" for correct, gentle "bonk" for wrong.
- **Look:** pink + black main palette, bright yellow/green bursts, CRASH!/SPLAT! sound-effect words,
  speech bubbles, wobbly comic lettering.

## Content
- Puzzles live in `puzzles.json` — one list Will and daughter own and groom.
- Sources: starter bank written by Claude, own additions via in-app form (Phase 2),
  weekly Claude-drafted batch into an approval pile (Phase 3). No scraping riddle websites.
- Picture riddles start as emoji riddles (no artwork needed).

## Technology
- Plain HTML / CSS / JavaScript web app (a PWA). No frameworks, no build step.
- Progress saved in the browser (localStorage). Hosted free on GitHub Pages.
- Install on iPhone via Safari → Share → Add to Home Screen. Same on Kindle Fire.
- Later: wrap with Capacitor for App Store / Amazon Appstore + daily reminders.

## Phases
1. Playable prototype (home screen, 3-part flow, clues, fuzzy typing, scoring, streak, sounds, ~50 puzzles)
2. Full puzzle bank, adaptive difficulty, levels/badges/PBs, add-a-puzzle form, real art
3. Literacy challenges, multiple players, practice mode, weekly puzzle generation
4. Publish (Capacitor, Apple dev account, App Store, Amazon Appstore, notifications)

## Running it locally
Open `index.html` in a browser, or run `python3 -m http.server 8080` in this folder
and visit http://localhost:8080. Add `?reset=1` to the URL to wipe saved progress,
`?day=2026-09-15` to pretend it's another day (handy for testing streaks).
