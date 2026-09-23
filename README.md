# ⚡ TYPERUSH: Professional Typing & Keyboard Diagnostic Platform

> **Type faster. Think sharper.**
> *A championship-grade typing speed suite, professional hardware keyboard tester, and real-time 1v1 multiplayer arena powered by Supabase Realtime Channels.*

---

## 🚀 Live Demo Quick Start

TYPERUSH runs seamlessly in the browser with **zero backend setup required**:

```bash
cd typerush
npm install
npm run dev
```

Open your browser to: **`http://localhost:5173`**

*(For 1v1 multiplayer testing, simply open two browser windows or tabs side-by-side to race in real time!)*

---

## 🎮 Platform Overview: 3 Major Systems

TYPERUSH is organized into three major technical systems accessible via the primary navigation header:

1. **TYPING**: Multi-mode typing speed, accuracy, and cadence testing suite.
2. **KEYBOARD TESTER**: Professional physical keyboard diagnostic and matrix testing tool.
3. **1V1 RACE**: Real-time multiplayer typing race powered by Supabase Realtime with local dual-window fallback.

---

## ⌨️ 1. Complete Typing Engine & Test Modes

### Test Modes
* **TIME MODE**: 15s (Sprint), 30s (Standard), and 60s (Endurance).
* **WORDS MODE**: 10, 25, 50, or 100 words. Timer runs as a secondary metric; the test ends when the target word count is completed (`"23 / 50 words"`).
* **QUOTE MODE**: Curated library of famous quotations with subtle author attribution (e.g. *“The future depends on what you do today.” — Mahatma Gandhi*).
* **CODE MODE**: Developer-focused snippets in **C, C++, Python, JavaScript, Java, HTML, CSS, and SQL**. Preserves indentation, brackets (`{}`, `[]`, `()`, `<>`), and symbols without distracting color clashes.
* **CUSTOM MODE**: Paste or type your own custom passage in setup (validated for min/max length). Pasting is blocked during the live test.
* **PRACTICE MODE**: Untimed, pressure-free sandbox with continuous WPM and accuracy calculations.
* **DAILY CHALLENGE**: Deterministic passage generated from the calendar date (`YYYY-MM-DD`). Synchronized for all typists worldwide with attempts and today's best result tracking.

### Deep Post-Test Analytics
* **Session Rating**: Factual letter grades (**A+, A, B+, B, C, D**) calculated from WPM, Accuracy, and Rhythm Consistency.
* **Smart Factual Insights**: Data-driven feedback (e.g., *"Your accuracy was higher than your previous average"*, *"You made the most errors on R"*).
* **Keyboard Heatmap & Error Analysis**: Displays error hotspots, most mistyped characters, and common mistake transitions (e.g. `R → T`).
* **Word-Level Diagnostics**: Highlights fastest word, slowest word, longest word, and most mistyped word.
* **Result Comparisons**: Direct comparison against your previous test (`+4 WPM`) and lifetime average (`+6 WPM`).
* **Share & Export**: One-click summary copy to clipboard, Web Share API integration, and formatted result export.

---

## 🛠️ 2. Professional Keyboard Tester

A dedicated diagnostic tool for inspecting physical keyboards and switch behavior:

* **Layout Support**: Switch seamlessly between **Full Size (104), TKL (87), 75%, 65%, and 60%**.
* **Physical Keystroke Detection**: Captures `e.code`, `e.key`, `e.location`, modifier states, and exact timestamps with zero input lag.
* **Key States**:
  - `Untested` (Neutral)
  - `Pressed` (Active cyan highlight)
  - `Tested` (Success emerald highlight)
  - `Stuck` (Alert state for keys held longer than 3.5s)
* **Simultaneous Rollover Test**: Live simultaneous input buffer measuring concurrent key presses (2-key, 3-key, 4-key, 6-key, custom).
* **Anti-Ghosting Verification Matrix**: Compares expected key clusters (WASD, QWE, Shift+Space+W) against detected keys and flags unexpected phantom signals.
* **Hold Timing & Response**: Measures browser-observed keydown-to-keyup duration in milliseconds.
* **Keyboard Health Report**: Summarizes keys tested, layout, observed rollover, anti-ghosting status, and allows one-click report copying.

---

## 🏁 3. Real-Time 1v1 Multiplayer Races (Supabase Realtime)

A true real-time head-to-head racing system:

* **Room System**: Host generates a 5-digit room code (e.g., `X7K92`) with one-click code copy and direct invite links.
* **1v1 Lobby**: Displays both competitors, host controls (duration, difficulty, mode), and Ready/Unready states.
* **Same Passage Guarantee**: Both competitors race on the exact same passage.
* **Synchronized Countdown**: Shared 3-2-1-GO countdown using synchronized timestamps.
* **Live Head-to-Head Track**: Shows your typing passage and live WPM alongside your opponent's live progress bar (`████████░░ 82%`) and live velocity.
* **Race Results & Rematch**: Winner podium celebration, head-to-head comparison stats, and a **REMATCH** button to immediately duel again with a new passage.
* **Supabase Integration**:
  - Connects to Supabase Realtime Channels (`broadcast` and `presence`) when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided (or entered in Settings).
  - Automatically falls back to an embedded `BroadcastChannel` engine so opening two tabs or windows races locally with zero configuration!

---

## 👤 4. Profile, Goals & Achievements

* **Competitor Profile**: Custom display name (e.g. `SHANMUKH`), initials avatar, and selectable visual gradients (Electric Cyan, Neon Mint, Cosmic Violet, Solar Sunset).
* **Personal Goals**: Select an active objective (Reach 80 WPM, 90 WPM, 100 WPM, Maintain 95% Accuracy) with an auto-updating progress bar.
* **Achievements System**:
  - ⚡ *FIRST TEST*: Complete your first test.
  - 🔥 *SPEEDSTER*: Reach 80+ WPM.
  - 🏆 *LIGHTNING*: Surpass 100+ WPM.
  - 🎯 *PRECISION*: Reach 98% accuracy.
  - ⏱️ *CONSISTENT*: Complete 10 tests.
  - 🏅 *DEDICATED*: Complete 25 tests.
  - 💻 *CODE MASTER*: Complete a Code Mode test.
  - 📅 *DAILY CHAMPION*: Complete a Daily Challenge.
* **Non-Intrusive Toasts**: Achievement unlocks trigger subtle Web Audio fanfares and corner badges without interrupting typing.

---

## 🎨 Design, Accessibility & Preferences

* **Theming**: Premium **Dark Graphite** (`#090d16`) with electric cyan (`#00f0ff`) accents, and crisp, high-contrast **Light Mode**.
* **Synthesized Web Audio API**: Realistic mechanical keyclicks, error thuds, countdown beeps, and completion chords generated locally (zero audio file downloads, default OFF).
* **Focus Mode**: Hides navigation and secondary cards for maximum typing focus.
* **Fullscreen Support**: Browser Fullscreen API integration.
* **Pre-Test Countdown (3-2-1-GO)**: Configurable in Settings.
* **Auto-Pause on Blur**: Gracefully pauses typing when window or tab loses focus.

---

## 📂 Source Code Architecture

```
src/
├── components/
│   ├── keyboardTester/
│   │   └── KeyboardTesterView.tsx  # Full physical keyboard diagnostics & rollover tester
│   ├── race/
│   │   ├── RaceLobby.tsx           # 1v1 room lobby, invite links, and host controls
│   │   ├── RaceStage.tsx           # Dual racer progress lanes and synchronized countdown
│   │   ├── RaceResults.tsx         # Head-to-head match summary and rematch trigger
│   │   └── RaceView.tsx            # Master race view orchestrator
│   ├── DailyChallengeView.tsx      # Deterministic calendar daily challenge
│   ├── DashboardPanel.tsx          # Lifetime statistics and duration records
│   ├── Header.tsx                  # Primary platform navigation and quick toggles
│   ├── HelpModal.tsx               # Metric formulas, mode guides, and shortcuts
│   ├── HistoryPanel.tsx            # Filterable, sortable, and searchable session history
│   ├── MetricsBar.tsx              # Live HUD metrics (WPM, Accuracy, Errors, Timer, Combo)
│   ├── OnboardingModal.tsx         # 3-step first-visit walkthrough
│   ├── PerformanceGraph.tsx        # Real-time and post-test SVG speed curve
│   ├── ProfileView.tsx             # Competitor profile, avatars, goals, achievements
│   ├── ResultsPanel.tsx            # Session ratings (A+ to D), heatmap, word analysis
│   ├── SettingsModal.tsx           # Preferences, Supabase config, and reset local data
│   ├── TestSetup.tsx               # Master mode selector (Time, Words, Quote, Code, Custom)
│   ├── TypingArea.tsx              # Core passage visualizer with pause & quote attribution
│   └── VirtualKeyboard.tsx         # Real-time keystroke reaction HUD
├── data/
│   ├── expandedPassages.ts         # Quotes, multi-language code snippets, daily challenges
│   └── passages.ts                 # Categorized text passages
├── hooks/
│   ├── useLocalStorage.ts          # Resilient JSON localStorage persistence
│   ├── useTimer.ts                 # High-precision delta countdown timer
│   └── useTypingEngine.ts          # Core typing comparison, word completion, heatmap
├── services/
│   └── supabaseRace.ts             # Supabase Realtime Channel & local BroadcastChannel 1v1 engine
├── types/
│   └── typing.ts                   # Domain TypeScript definitions
└── utils/
    ├── audioSynth.ts               # Web Audio API sound synthesizer
    ├── expandedAnalytics.ts        # Session ratings, smart insights, heatmap, word analysis
    └── typingMetrics.ts            # Net/Raw WPM, accuracy, consistency, and score math
```

---

*Engineered for competitive excellence, physical keyboard diagnostics, and live competition demonstrations.*
