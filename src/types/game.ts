export type GameModeType = 'falling-words' | 'time-attack' | 'survival' | 'zen';
export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'insane';
export type PowerUpType = 'freeze' | 'slow' | 'clear' | 'shield' | 'double' | 'timeBonus';

export interface FallingWord {
  id: string;
  word: string;
  typedPrefix: string;
  x: number; // percentage (5% to 85%)
  y: number; // percentage (0% to 100%)
  speed: number; // percentage per second
  isSpecial?: boolean;
  powerUp?: PowerUpType;
  points: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingMs: number;
  durationMs: number;
}

export interface GameHUDState {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  lives: number;
  maxLives: number;
  level: number;
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  wordsMissed: number;
  timeElapsed: number;
  timeRemaining?: number; // for Time Attack
  activePowerUps: Partial<Record<PowerUpType, number>>; // remaining ms
}

export interface GameResult {
  id: string;
  timestamp: number;
  mode: GameModeType;
  difficulty: GameDifficulty;
  score: number;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  level: number;
  wordsTyped: number;
  wordsMissed: number;
  timeSurvivedSeconds: number;
  xpEarned: number;
  isNewHighScore: boolean;
}

export interface UserGameStats {
  gamesPlayed: number;
  bestScore: number;
  bestWpm: number;
  bestAccuracy: number;
  highestCombo: number;
  totalWords: number;
  totalXp: number;
  longestSurvivalSeconds: number;
  modeStats: Record<GameModeType, { bestScore: number; gamesPlayed: number; bestWpm: number }>;
  history: GameResult[];
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  playerName: string;
  avatarStyle: string;
  mode: GameModeType;
  difficulty: GameDifficulty;
  score: number;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  level: number;
  date: string;
  isUser?: boolean;
}

export interface GameSettings {
  difficulty: GameDifficulty;
  speedModifier: number; // 0.8, 1.0, 1.25, 1.5
  soundEnabled: boolean;
  particlesEnabled: boolean;
  reducedMotion: boolean;
  timeAttackDuration: 30 | 60 | 120;
}
