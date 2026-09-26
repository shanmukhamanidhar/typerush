export type TestDuration = 15 | 30 | 60 | 120 | 180 | number;
export type WordCountOption = 10 | 25 | 50 | 100 | 200 | 500 | 1000 | number;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type DifficultyRule = 'normal' | 'expert' | 'master';
export type Category = 'general' | 'technology' | 'science' | 'programming' | 'quotes' | 'numbers' | 'random';
export type TestMode = 'time' | 'words' | 'quote' | 'code' | 'custom' | 'zen' | 'practice' | 'daily';
export type QuoteLength = 'short' | 'medium' | 'long' | 'random';
export type CodeLanguage = 'c' | 'cpp' | 'python' | 'javascript' | 'typescript' | 'java' | 'html' | 'css' | 'sql' | 'rust' | 'go';
export type TestState = 'idle' | 'running' | 'paused' | 'completed' | 'failed';
export type CursorStyle = 'line' | 'block' | 'underline' | 'off';
export type CharStatus = 'correct' | 'incorrect' | 'extra' | 'missed' | 'current' | 'pending';
export type KeyboardLayoutType = 'full' | 'tkl' | '75' | '65' | '60' | 'custom';

// Advanced Input & Engine Rules
export type StopOnError = 'off' | 'word' | 'letter';
export type PaceCaretMode = 'off' | 'pb' | 'average' | 'custom';
export type KeymapLayout = 'qwerty' | 'qwertz' | 'azerty' | 'dvorak' | 'colemak';
export type KeymapMode = 'off' | 'reactive' | 'next-key';
export type SoundPack = 'mechanical' | 'click' | 'beep' | 'pop' | 'typewriter';

export type LanguageCode = 
  | 'en' 
  | 'en-gb' 
  | 'es' 
  | 'fr' 
  | 'de' 
  | 'it' 
  | 'pt' 
  | 'nl' 
  | 'ja-ro';

export type WordSetSize = 200 | 500 | 1000 | 'extended';

export type ThemeId = 
  | 'graphite-cyan' 
  | 'obsidian' 
  | 'cyberpunk' 
  | 'terminal80' 
  | 'solarflare' 
  | 'arctic' 
  | 'solar-orange' 
  | 'synthwave' 
  | 'paper-light' 
  | 'monochrome' 
  | 'custom';

export type BackgroundStyle = 'solid' | 'grid' | 'dots' | 'scanlines';

export interface CustomThemeColors {
  bg: string;
  surface: string;
  border: string;
  text: string;
  primary: string;
  error: string;
}

export interface MetricSnapshot {
  second: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
}

export interface WordAnalysisResult {
  fastestWord?: { word: string; wpm: number };
  slowestWord?: { word: string; wpm: number };
  longestWord?: { word: string; length: number };
  mostMistypedWord?: { word: string; errors: number };
}

export interface KeyHeatmapItem {
  key: string;
  typed: number;
  correct: number;
  errors: number;
  mistakesTo: Record<string, number>;
}

export interface ErrorAnalysisData {
  totalErrors: number;
  errorRate: number;
  mostMistypedKey?: { key: string; count: number };
  commonMistakes: { from: string; to: string; count: number }[];
}

export interface CharacterBreakdown {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

export interface BurstSpeed {
  peakWpm: number;
  avgBurstWpm: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  duration?: number;
  wordCount?: number;
  difficulty: Difficulty;
  difficultyRule?: DifficultyRule;
  category: Category;
  language?: CodeLanguage;
  quoteAuthor?: string;
  quoteLength?: QuoteLength;
  dictLanguage?: LanguageCode;
  wordSet?: WordSetSize;
  punctuationEnabled?: boolean;
  numbersEnabled?: boolean;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  characterBreakdown?: CharacterBreakdown;
  burstSpeed?: BurstSpeed;
  score: number;
  sessionRating: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  consistency: number;
  metricsHistory: MetricSnapshot[];
  passageSnippet: string;
  heatmap?: Record<string, KeyHeatmapItem>;
  wordAnalysis?: WordAnalysisResult;
  errorAnalysis?: ErrorAnalysisData;
  smartInsight?: string;
  tags?: string[];
  isFailed?: boolean;
  failedReason?: string;
}

export interface TestPreset {
  id: string;
  name: string;
  description?: string;
  mode: TestMode;
  duration?: number;
  wordCount?: number;
  difficultyRule: DifficultyRule;
  punctuation: boolean;
  numbers: boolean;
  language: LanguageCode;
  wordSet: WordSetSize;
}

export type QuickRestartOption = 'off' | 'esc' | 'tab' | 'enter';
export type RepeatQuotesOption = 'off' | 'typing';
export type CaretAnimationOption = 'smooth' | 'static' | 'blink';
export type CaretColorOption = 'accent' | 'neutral';
export type TypingSoundOption = 'soft' | 'click' | 'minimal' | 'custom';
export type FontSizeOption = 'sm' | 'md' | 'lg' | 'xl';
export type FontFamilyOption = 'times' | 'mono' | 'sans';
export type UiDensityOption = 'compact' | 'comfortable';
export type TextOpacityOption = 'primary' | 'secondary' | 'muted';

export interface HideElementsSettings {
  header: boolean;
  footer: boolean;
  timer: boolean;
  accuracy: boolean;
  wpm: boolean;
  graph: boolean;
  testConfig: boolean;
  progressBar: boolean;
  extraStats: boolean;
}

export interface LanguagePack {
  id: string;
  name: string;
  category: 'english' | 'spanish' | 'specialty' | 'code' | 'other';
  wordsCount?: number;
  description: string;
  words: string[];
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  userId?: string;
  username?: string;
  avatarStyle?: string;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  consistency: number;
  date: string;
  testType: string;
  duration?: number;
  language: string;
  isCurrentUser?: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  themeId: ThemeId;
  customColors?: CustomThemeColors;
  backgroundStyle: BackgroundStyle;
  
  // Sound Settings (Subtle UI sounds, default OFF)
  soundEnabled: boolean;
  soundPack: SoundPack;
  typingSound: TypingSoundOption;
  soundVolume: number; // 0 - 100
  errorSound: boolean;
  completionSound: boolean;

  // Caret Settings
  cursorStyle: CursorStyle;
  caretAnimation: CaretAnimationOption;
  caretColor: CaretColorOption;
  caretOpacity: number; // 20 - 100

  // Appearance & Typography
  fontSize: FontSizeOption;
  fontFamily: FontFamilyOption;
  uiDensity: UiDensityOption;
  textOpacity: TextOpacityOption;

  // Behavior Settings
  difficulty: Difficulty;
  difficultyRule: DifficultyRule;
  quickRestart: QuickRestartOption;
  repeatQuotes: RepeatQuotesOption;
  blindMode: boolean;
  alwaysShowWordsHistory: boolean;
  singleListCommandLine: 'manual' | 'on';
  minWpm: number; // 0 = disabled
  minAccuracy: number; // 0 = disabled

  // Input Settings
  inputMode: 'standard' | 'strict';
  stopOnError: StopOnError; // off | word | letter
  confidenceMode: boolean; // Cannot backspace
  freedomMode: boolean; // Type extra letters
  strictSpace: boolean; // Space only when word complete
  quickEnd: boolean; // Finish immediately on last char
  pauseOnBlur: boolean;
  focusMode: boolean;

  // Pace Caret
  paceCaret: PaceCaretMode;
  paceWpm: number; // Custom target WPM for ghost cursor

  // Hide Elements
  hideElements: HideElementsSettings;

  // Active Language
  language: string;

  // Presets & Tags
  presets: TestPreset[];
  activeTags: string[];
  availableTags: string[];
  
  // Keyboard Tester
  keyboardVisible: boolean;
  keymapLayout: KeymapLayout;
  keymapMode: KeymapMode;
  liveGraphVisible: boolean;
  countdownEnabled: boolean;

  // Supabase
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface PersonalBests {
  bestWpm: number;
  bestAccuracy: number;
  bestScore: number;
  best15s: number;
  best30s: number;
  best60s: number;
  best120s?: number;
  bestWords10: number;
  bestWords25: number;
  bestWords50: number;
  bestWords100: number;
  bestWords200?: number;
}

export interface UserProfile {
  displayName: string;
  avatarStyle: 'cyan' | 'neon' | 'sunset' | 'orange' | 'purple';
  selectedGoalId?: string;
  hasCompletedOnboarding: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'wpm' | 'accuracy' | 'tests';
  target: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: number;
}

export interface DailyChallengeRecord {
  date: string; // YYYY-MM-DD
  attempts: number;
  bestWpm: number;
  bestAccuracy: number;
  bestScore: number;
  completed: boolean;
}

export interface Passage {
  id: string;
  category: Category;
  difficulty: Difficulty;
  text: string;
  title: string;
}

export interface QuoteItem {
  id: string;
  author: string;
  text: string;
  category: Category;
  lengthTier?: 'short' | 'medium' | 'long';
}

export interface CodeItem {
  id: string;
  language: CodeLanguage;
  title: string;
  code: string;
}

export interface KeyboardTesterReport {
  id: string;
  timestamp: number;
  layout: KeyboardLayoutType;
  keysTested: number;
  keysTotal: number;
  maxRollover: number;
  ghostingStatus: 'PASS' | 'PARTIAL DETECTION' | 'POSSIBLE GHOSTING' | 'NOT TESTED';
  issues: string[];
}

export interface RacePlayer {
  id: string;
  name: string;
  avatarStyle: string;
  isHost: boolean;
  isReady: boolean;
  progress: number;
  wpm: number;
  accuracy: number;
  isFinished: boolean;
  finishTime?: number;
  rank?: number;
  isConnected?: boolean;
  disconnectedAt?: number;
  metricsHistory?: { second: number; wpm: number; accuracy?: number }[];
}

export interface RaceRoom {
  code: string;
  hostId: string;
  status: 'lobby' | 'countdown' | 'racing' | 'completed';
  passage: string;
  duration: number;
  testMode: 'time' | 'words';
  wordCount?: number;
  wordSet?: string;
  maxPlayers: number;
  difficulty: Difficulty;
  category: Category;
  startTimestamp?: number;
  players: Record<string, RacePlayer>;
}

export interface WeaknessItem {
  word: string;
  mistakes: number;
  lastTested: number;
}

export interface UserWeaknesses {
  missedWords: Record<string, number>;
  slowWords: Record<string, number>;
  missedBigrams: Record<string, number>;
}
