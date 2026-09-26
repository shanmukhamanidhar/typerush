import { 
  GameDifficulty, 
  GameModeType, 
  PowerUpType, 
  FallingWord, 
  GameResult 
} from '../types/game';

// Tiered Vocabulary Pools
export const GAME_WORD_POOLS = {
  tier1: [
    'cat', 'run', 'code', 'type', 'fast', 'byte', 'loop', 'ship', 'scan', 'grid',
    'data', 'tech', 'jump', 'flow', 'glow', 'task', 'view', 'link', 'sync', 'neon',
    'node', 'time', 'rust', 'cool', 'core', 'user', 'wave', 'port', 'rank', 'zoom',
    'flux', 'play', 'race', 'dash', 'fire', 'star', 'ping', 'host', 'root', 'push',
    'pull', 'pipe', 'hash', 'flag', 'pace', 'peak', 'zone', 'gear', 'mode', 'drop'
  ],
  tier2: [
    'keyboard', 'terminal', 'computer', 'protocol', 'database', 'network', 'compiler',
    'reaction', 'velocity', 'algorithm', 'telemetry', 'sequence', 'hardware', 'friction',
    'momentum', 'spectrum', 'satellite', 'processor', 'interface', 'keystroke', 'dynamic',
    'function', 'reactive', 'debugger', 'download', 'memory', 'pipeline', 'firewall',
    'firmware', 'variable', 'resource', 'overflow', 'platform', 'frontend', 'champion'
  ],
  tier3: [
    'architecture', 'authentication', 'cryptography', 'implementation', 'visualization',
    'asynchronous', 'infrastructure', 'synchronization', 'vulnerability', 'optimization',
    'microprocessor', 'multithreading', 'orchestration', 'international', 'deterministic',
    'configuration', 'accessibility', 'computational', 'cybersecurity', 'compatibility',
    'encapsulation', 'interoperable', 'nanotechnology', 'reproducibility', 'supercomputer'
  ]
};

export const POWER_UP_CONFIG: Record<PowerUpType, { label: string; text: string; color: string; durationMs: number }> = {
  freeze: { label: 'FREEZE', text: 'FREEZE', color: '#FFA347', durationMs: 4000 },
  slow: { label: 'SLOW', text: 'SLOW', color: '#F59E0B', durationMs: 6000 },
  clear: { label: 'CLEAR', text: 'NUKE', color: '#EF4444', durationMs: 0 },
  shield: { label: 'SHIELD', text: 'SHIELD', color: '#FF5A00', durationMs: 0 },
  double: { label: 'DOUBLE', text: '2X SCORE', color: '#FF6E1A', durationMs: 8000 },
  timeBonus: { label: 'TIME', text: '+15s', color: '#FF6E1A', durationMs: 0 },
};

/**
 * Returns combo multiplier for score calculation
 */
export function getComboMultiplier(combo: number): number {
  if (combo >= 50) return 5.0;
  if (combo >= 35) return 4.0;
  if (combo >= 20) return 3.0;
  if (combo >= 10) return 2.0;
  if (combo >= 5) return 1.5;
  return 1.0;
}

/**
 * Calculates score for a detonated word
 */
export function calculateWordPoints(
  word: string,
  combo: number,
  level: number,
  difficulty: GameDifficulty,
  isDoubleScore: boolean
): number {
  const basePoints = word.length * 35;
  const comboMult = getComboMultiplier(combo);
  const diffMultiplier: Record<GameDifficulty, number> = {
    easy: 0.9,
    normal: 1.0,
    hard: 1.3,
    insane: 1.6,
  };

  const levelBonus = 1 + (level - 1) * 0.12;
  const doubleMult = isDoubleScore ? 2.0 : 1.0;

  return Math.round(basePoints * comboMult * (diffMultiplier[difficulty] || 1.0) * levelBonus * doubleMult);
}

/**
 * Spawns a falling word based on current game level & active words
 */
export function generateSpawnWord(
  level: number,
  activeWords: FallingWord[],
  difficulty: GameDifficulty
): FallingWord {
  // Determine tier
  let pool = GAME_WORD_POOLS.tier1;
  if (level >= 7 || difficulty === 'insane') {
    pool = Math.random() > 0.4 ? GAME_WORD_POOLS.tier3 : GAME_WORD_POOLS.tier2;
  } else if (level >= 4 || difficulty === 'hard') {
    pool = Math.random() > 0.3 ? GAME_WORD_POOLS.tier2 : GAME_WORD_POOLS.tier1;
  }

  // Active word strings to avoid duplicates
  const existingSet = new Set(activeWords.map(w => w.word.toLowerCase()));
  const candidates = pool.filter(w => !existingSet.has(w.toLowerCase()));
  const selectedWord = candidates.length > 0 
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : pool[Math.floor(Math.random() * pool.length)];

  // Power-up chance (~12%)
  const isSpecial = Math.random() < 0.12;
  let powerUp: PowerUpType | undefined = undefined;
  if (isSpecial) {
    const powerUps: PowerUpType[] = ['freeze', 'slow', 'clear', 'shield', 'double', 'timeBonus'];
    powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
  }

  // Calculate random X position ensuring word stays within bounds (8% to 78%)
  const x = Math.floor(Math.random() * 70) + 8;

  // Base speed in percentage per second
  const difficultySpeedBase: Record<GameDifficulty, number> = {
    easy: 5.5,
    normal: 8.0,
    hard: 11.5,
    insane: 15.5,
  };

  const baseSpeed = difficultySpeedBase[difficulty] || 8.0;
  const speed = baseSpeed + (level - 1) * 0.75 + (Math.random() * 1.5 - 0.75);

  return {
    id: `fw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    word: selectedWord,
    typedPrefix: '',
    x,
    y: 0,
    speed: Math.max(4.0, speed),
    isSpecial,
    powerUp,
    points: selectedWord.length * 35,
  };
}

/**
 * Calculates XP earned from a completed game session
 */
export function calculateXpEarned(
  score: number,
  wordsTyped: number,
  maxCombo: number,
  level: number
): number {
  const base = Math.floor(score / 12);
  const wordsBonus = wordsTyped * 4;
  const comboBonus = maxCombo * 8;
  const levelBonus = level * 25;
  return Math.max(10, base + wordsBonus + comboBonus + levelBonus);
}

/**
 * Anti-cheat score submission validator
 */
export function validateGameSubmission(result: GameResult): boolean {
  // Check impossible speeds or times
  if (result.wpm > 250) return false;
  if (result.accuracy > 100 || result.accuracy < 0) return false;
  if (result.timeSurvivedSeconds <= 1 && result.score > 200) return false;

  // Verify score to word ratio
  if (result.wordsTyped === 0 && result.score > 0) return false;
  const maxPossiblePointsPerWord = 3000;
  if (result.score > result.wordsTyped * maxPossiblePointsPerWord && result.wordsTyped > 0) return false;

  return true;
}
