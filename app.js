/* =====================================================================
   Doughy-O — game logic
   Plain JavaScript, no frameworks. Read top to bottom:
     1. Settings and the level ladder
     2. Saving and loading progress (localStorage = the phone's memory)
     3. Working out what "today" is and picking today's puzzles
     4. Checking a typed answer (with forgiving spelling)
     5. Sounds (made with code, no audio files needed)
     6. The screens: home → riddle → maths → joke → summary
   ===================================================================== */

// ---------- 1. Settings ----------
const LEVELS = ['Egg', 'Hatchling', 'Riddle Rookie', 'Brain Splatter', 'Puzzle Pro', 'Spike Master', 'Doughy Legend'];
const DAYS_PER_LEVEL = 3;        // keep a streak going 3 days = go up a level
const MAX_CLUES = 3;
const SAVE_KEY = 'doughy-o-save';

// ---------- 2. Saving and loading ----------
function freshSave() {
  return {
    streak: 0, bestStreak: 0, levelIndex: 0,
    totalScore: 0, bestDayScore: 0,
    difficulty: { riddles: 1, maths: 1 },   // each subject climbs on its own
    lastResult: { riddles: null, maths: null }, // true/false from the last go, for the "drop slightly" rule
    lastPlayed: null,                         // 'YYYY-MM-DD' of the last day finished
    usedIds: [],                              // puzzles already seen, so they don't repeat
    today: null                               // { date, riddle, maths, joke, riddlePts, mathsPts, stage }
  };
}
function loadSave() {
  try { return Object.assign(freshSave(), JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); }
  catch { return freshSave(); }
}
function persist() { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }

// ---------- 3. Today and picking puzzles ----------
const params = new URLSearchParams(location.search);
if (params.get('reset') === '1') { localStorage.removeItem(SAVE_KEY); history.replaceState(null, '', location.pathname); }
let save = loadSave();

function todayString() {
  if (params.get('day')) return params.get('day');          // ?day=2026-09-15 pretends it's another day
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const TODAY = todayString();

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// Turn a date string into a repeatable "random" number, so reloading gives the same puzzle
function seededRandom(seed) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
}

// Pick one puzzle from a pool at (or nearest to) the wanted difficulty, avoiding ones already seen
function pickPuzzle(pool, wantLevel, rand) {
  let unused = pool.filter(p => !save.usedIds.includes(p.id));
  if (unused.length === 0) { save.usedIds = save.usedIds.filter(id => !pool.some(p => p.id === id)); unused = pool; } // seen them all: start again
  unused.sort((a, b) => Math.abs(a.level - wantLevel) - Math.abs(b.level - wantLevel));
  const closest = Math.abs(unused[0].level - wantLevel);
  const candidates = unused.filter(p => Math.abs(p.level - wantLevel) === closest);
  return candidates[Math.floor(rand() * candidates.length)];
}

let PUZZLES = null;

function setUpToday() {
  // Missed a day? Streak breaks and you drop one level (only applied once)
  if (save.lastPlayed && daysBetween(save.lastPlayed, TODAY) > 1 && save.streak > 0) {
    save.streak = 0;
    save.levelIndex = Math.max(0, save.levelIndex - 1);
    save.missedNote = "You missed a day, so the streak reset. Let's build a new one!";
  }
  if (!save.today || save.today.date !== TODAY) {
    const rand = seededRandom(TODAY + 'doughy');
    const riddle = pickPuzzle(PUZZLES.riddles, save.difficulty.riddles, rand);
    const maths = pickPuzzle(PUZZLES.maths, save.difficulty.maths, rand);
    const joke = PUZZLES.jokes[Math.floor(rand() * PUZZLES.jokes.length)];
    save.today = { date: TODAY, riddle: riddle.id, maths: maths.id, joke: joke.id, riddlePts: null, mathsPts: null, stage: 'home' };
  }
  persist();
}
function byId(pool, id) { return pool.find(p => p.id === id); }

// ---------- 4. Checking answers ----------
function normalise(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9£.: ]/g, ' ')   // drop punctuation
    .replace(/\s+/g, ' ').trim()
    .replace(/^(a|an|the|its|it is|it s) /, ''); // "a piano" → "piano"
}
// How many single-letter edits turn one word into another (Levenshtein distance)
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
function isCorrect(typed, answers) {
  const t = normalise(typed);
  if (!t) return false;
  return answers.some(ans => {
    const a = normalise(ans);
    if (t === a) return true;
    if (/^\d/.test(a)) return false;                 // numbers must be exact
    const allowed = a.length <= 4 ? 0 : a.length <= 7 ? 1 : 2;   // short words: strict; long words: 2 slips OK
    return editDistance(t, a) <= allowed;
  });
}

// ---------- 5. Sounds ----------
let audioCtx = null;
function ctx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
function tone(freq, start, length, type = 'square', vol = 0.2) {
  const c = ctx(), o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + length);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start); o.stop(c.currentTime + start + length);
}
function playTada() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.5)); tone(1047, 0.6, 0.9, 'sawtooth', 0.15); }
function playBonk() { // gentle bonk: a soft low note that drops
  const c = ctx(), o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(220, c.currentTime); o.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.25);
  g.gain.setValueAtTime(0.3, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
  o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.3);
}
function playDrumroll(seconds) { // lots of tiny thuds, getting faster
  const c = ctx(), n = Math.floor(seconds * 14);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * seconds * (1 - 0.3 * (i / n));
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.value = 150 + Math.random() * 30;
    g.gain.setValueAtTime(0.25, c.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.06);
    o.connect(g).connect(c.destination); o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.07);
  }
}

// ---------- 6. Screens ----------
const $ = id => document.getElementById(id);
function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden')); $(id).classList.remove('hidden'); window.scrollTo(0, 0); }

function renderHome() {
  $('stat-streak').textContent = save.streak;
  $('stat-level').textContent = LEVELS[save.levelIndex];
  $('stat-best').textContent = save.bestStreak;
  const done = save.today.stage === 'done';
  $('btn-play').textContent = done ? 'SEE TODAY\'S SCORE' : (save.today.stage === 'home' ? 'PLAY TODAY\'S PUZZLE' : 'CARRY ON!');
  $('home-bubble').textContent = done ? 'You\'ve done today\'s. Back tomorrow!' : (save.streak > 0 ? `Streak of ${save.streak}! Keep it going!` : 'Ready for today\'s riddle?');
  $('home-note').textContent = save.missedNote || '';
  show('screen-home');
}

// One function runs both the riddle and the maths puzzle
let current = null; // { subject: 'riddles'|'maths', puzzle, cluesUsed, finished, mode: 'daily'|'practice' }
function startPuzzle(subject, mode = 'daily') {
  const pool = PUZZLES[subject];
  let puzzle;
  if (mode === 'daily') {
    puzzle = byId(pool, save.today[subject === 'riddles' ? 'riddle' : 'maths']);
    save.today.stage = subject; persist();
  } else {
    // Practice: pick a fresh puzzle at the current level. Levels climb as you get them right.
    puzzle = pickPuzzle(pool, save.difficulty[subject], Math.random);
  }
  current = { subject, puzzle, cluesUsed: 0, finished: false, mode };
  $('puzzle-tag').textContent = (subject === 'riddles' ? 'RIDDLE' : 'MATHS') + ' · LVL ' + save.difficulty[subject];
  $('practice-nav').classList.add('hidden');
  $('puzzle-q').textContent = current.puzzle.q;
  $('clues').innerHTML = '';
  $('answer-input').value = '';
  $('answer-input').disabled = false;
  $('feedback').classList.add('hidden');
  $('btn-clue').classList.remove('hidden');
  $('answer-form').querySelector('button').disabled = false;
  updatePoints();
  show('screen-puzzle');
  $('answer-input').focus();
}
function pointsNow() { return Math.max(1, 3 - current.cluesUsed); }
function updatePoints() {
  $('puzzle-points').textContent = `${pointsNow()} pt${pointsNow() === 1 ? '' : 's'}`;
  if (current.cluesUsed >= MAX_CLUES) $('btn-clue').classList.add('hidden');
}
function giveClue() {
  if (current.cluesUsed >= MAX_CLUES || current.finished) return;
  const li = document.createElement('li');
  li.textContent = `Clue ${current.cluesUsed + 1}: ${current.puzzle.clues[current.cluesUsed]}`;
  $('clues').appendChild(li);
  current.cluesUsed++;
  updatePoints();
  $('answer-input').focus();
}
function finishPuzzle(correct) {
  current.finished = true;
  const pts = correct ? pointsNow() : 0;
  const key = current.subject === 'riddles' ? 'riddlePts' : 'mathsPts';
  save.today[key] = pts;

  // Adaptive difficulty: right = up a notch; wrong = stay, or drop if you also got the last one wrong
  const d = save.difficulty, s = current.subject;
  if (correct) d[s] = Math.min(10, d[s] + 1);
  else if (save.lastResult[s] === false) d[s] = Math.max(1, d[s] - 1);
  save.lastResult[s] = correct;
  save.usedIds.push(current.puzzle.id);

  // The DAILY riddle is the one that counts for the streak. Practice never touches it.
  if (s === 'riddles' && current.mode === 'daily') {
    if (correct) {
      save.streak++;
      save.bestStreak = Math.max(save.bestStreak, save.streak);
      if (save.streak % DAYS_PER_LEVEL === 0) save.levelIndex = Math.min(LEVELS.length - 1, save.levelIndex + 1);
    } else {
      save.streak = 0;
      save.levelIndex = Math.max(0, save.levelIndex - 1);
    }
  }
  save.totalScore += pts;
  persist();

  const fb = $('feedback');
  fb.classList.remove('hidden', 'good', 'bad');
  fb.classList.add(correct ? 'good' : 'bad');
  fb.innerHTML = correct
    ? `${['KAPOW!', 'CRASH!', 'SPLAT!', 'BOOM!'][Math.floor(Math.random() * 4)]}<span class="sub">+${pts} point${pts === 1 ? '' : 's'}</span>`
    : `BONK!<span class="sub">The answer was: ${current.puzzle.answers[0]}</span>`;
  $('doughy2').classList.add(correct ? 'happy' : 'sad');
  setTimeout(() => $('doughy2').classList.remove('happy', 'sad'), 2500);
  $('answer-input').disabled = true;
  $('btn-clue').classList.add('hidden');
  const btn = $('answer-form').querySelector('button');
  btn.disabled = true;
  correct ? playTada() : playBonk();

  if (current.mode === 'practice') {
    setTimeout(() => $('practice-nav').classList.remove('hidden'), 1200);
  } else {
    setTimeout(() => s === 'riddles' ? startPuzzle('maths') : startJoke(), 2600);
  }
}
function submitAnswer(e) {
  e.preventDefault();
  if (current.finished) return;
  const typed = $('answer-input').value;
  if (!typed.trim()) return;
  if (isCorrect(typed, current.puzzle.answers)) return finishPuzzle(true);

  // Wrong: gentle bonk, then either hand out a clue or, if all clues are gone, end it
  playBonk();
  $('doughy2').classList.add('sad'); setTimeout(() => $('doughy2').classList.remove('sad'), 900);
  $('answer-input').value = '';
  if (current.cluesUsed < MAX_CLUES) {
    giveClue();
    $('answer-input').placeholder = 'Not quite! Try again...';
  } else {
    finishPuzzle(false);
  }
}

function startJoke() {
  save.today.stage = 'joke'; persist();
  const joke = byId(PUZZLES.jokes, save.today.joke);
  $('joke-setup').textContent = joke.setup;
  $('joke-punch').textContent = joke.punch;
  $('joke-punch').classList.add('hidden');
  $('btn-finish').classList.add('hidden');
  $('btn-punch').classList.remove('hidden');
  $('btn-punch').disabled = false;
  show('screen-joke');
}
function tellPunchline() {
  $('btn-punch').disabled = true;
  playDrumroll(1.6);
  setTimeout(() => {
    $('joke-punch').classList.remove('hidden');
    $('btn-punch').classList.add('hidden');
    $('btn-finish').classList.remove('hidden');
    $('doughy3').classList.add('happy');
    tone(880, 0, 0.15); tone(1175, 0.15, 0.4);
  }, 1700);
}

function showSummary() {
  save.today.stage = 'done';
  save.lastPlayed = TODAY;
  save.missedNote = '';
  const total = (save.today.riddlePts || 0) + (save.today.mathsPts || 0);
  if (!save.today.counted) { save.bestDayScore = Math.max(save.bestDayScore, total); save.today.counted = true; }
  persist();
  $('summary-title').textContent = total >= 5 ? 'KAPOW!' : total >= 3 ? 'CRASH!' : total > 0 ? 'NOT BAD!' : 'BONK!';
  $('sum-riddle').textContent = save.today.riddlePts || 0;
  $('sum-maths').textContent = save.today.mathsPts || 0;
  $('sum-total').textContent = total;
  $('sum-streak').textContent = save.streak;
  $('sum-level').textContent = LEVELS[save.levelIndex];
  $('sum-alltime').textContent = save.totalScore;
  $('sum-note').textContent = total === save.bestDayScore && total > 0 ? `Best day score ever: ${total}! Come back tomorrow.` : 'Come back tomorrow for a new one!';
  show('screen-summary');
}

// Carry on from wherever you were if you closed the app halfway through
function resumeToday() {
  const st = save.today.stage;
  if (st === 'done') return showSummary();
  if (st === 'joke') return startJoke();
  if (st === 'maths' && save.today.riddlePts !== null) return startPuzzle('maths');
  if (save.today.riddlePts !== null && save.today.mathsPts !== null) return startJoke();
  if (save.today.riddlePts !== null) return startPuzzle('maths');
  startPuzzle('riddles');
}

// ---------- Wire up buttons and go ----------
$('btn-play').addEventListener('click', () => { ctx(); resumeToday(); }); // ctx() = unlock sound on iPhone (needs a tap first)
$('answer-form').addEventListener('submit', submitAnswer);
$('btn-clue').addEventListener('click', giveClue);
$('btn-punch').addEventListener('click', tellPunchline);
$('btn-finish').addEventListener('click', showSummary);
$('btn-home').addEventListener('click', renderHome);
document.querySelectorAll('[data-practice]').forEach(b => b.addEventListener('click', () => { ctx(); startPuzzle(b.dataset.practice, 'practice'); }));
$('btn-next').addEventListener('click', () => startPuzzle(current.subject, 'practice'));
$('btn-stop').addEventListener('click', renderHome);

fetch('puzzles.json').then(r => r.json()).then(data => { PUZZLES = data; setUpToday(); renderHome(); });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
