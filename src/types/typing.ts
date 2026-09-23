export type TestDuration = 15 | 30 | 60;
export type WordCountOption = 10 | 25 | 50 | 100;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'general' | 'technology' | 'science' | 'programming' | 'random';
export type TestMode = 'time' | 'words' | 'quote' | 'code' | 'custom' | 'practice' | 'daily';
export type CodeLanguage = 'c' | 'cpp' | 'python' | 'javascript' | 'java' | 'html' | 'css' | 'sql';
export type TestState = 'idle' | 'running' | 'paused' | 'completed';
export type CursorStyle = 'line' | 'block' | 'underline';
export type CharStatus = 'correct' | 'incorrect' | 'current' | 'pending';
export type KeyboardLayoutType = 'full' | 'tkl' | '75' | '65' | '60' | 'custom';

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

export interface TestResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  duration?: TestDuration;
  wordCount?: WordCountOption;
  difficulty: Difficulty;
  category: Category;
  language?: CodeLanguage;
  quoteAuthor?: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  score: number;
  sessionRating: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  consistency: number;
  metricsHistory: MetricSnapshot[];
  passageSnippet: string;
  heatmap?: Record<string, KeyHeatmapItem>;
  wordAnalysis?: WordAnalysisResult;
  errorAnalysis?: ErrorAnalysisData;
  smartInsight?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  keyboardVisible: boolean;
  liveGraphVisible: boolean;
  cursorStyle: CursorStyle;
  countdownEnabled: boolean;
  pauseOnBlur: boolean;
  focusMode: boolean;
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
  bestWords10: number;
  bestWords25: number;
  bestWords50: number;
  bestWords100: number;
}

export interface UserProfile {
  displayName: string;
  avatarStyle: 'cyan' | 'neon' | 'sunset' | 'emerald' | 'purple';
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
}

export interface RaceRoom {
  code: string;
  hostId: string;
  status: 'lobby' | 'countdown' | 'racing' | 'completed';
  passage: string;
  duration: number;
  testMode: 'time' | 'words';
  wordCount?: number;
  difficulty: Difficulty;
  category: Category;
  startTimestamp?: number;
  players: Record<string, RacePlayer>;
}
