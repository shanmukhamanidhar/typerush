import { Difficulty, MetricSnapshot } from '../types/typing';

/**
 * Calculates Net Words Per Minute (WPM) safely.
 * Net WPM = (correctly typed characters / 5) / elapsed minutes
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const wpm = (correctChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Calculates Gross/Raw WPM.
 * Gross WPM = (total typed characters / 5) / elapsed minutes
 */
export function calculateRawWpm(totalTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || totalTypedChars <= 0) return 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const rawWpm = (totalTypedChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(rawWpm));
}

/**
 * Calculates Accuracy percentage safely.
 * Accuracy = (correct characters / total typed characters) * 100
 */
export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars <= 0) return 100;
  const acc = (correctChars / totalTypedChars) * 100;
  return Math.min(100, Math.max(0, parseFloat(acc.toFixed(1))));
}

/**
 * Calculates typing consistency across seconds.
 * 100% means perfectly uniform typing speed throughout the test.
 */
export function calculateConsistency(history: MetricSnapshot[]): number {
  if (history.length < 2) return 100;
  
  // Ignore initial 1-2 seconds where speed ramps up
  const samples = history.slice(1).map(h => h.wpm);
  if (samples.length === 0) return 100;

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  if (mean <= 0) return 100;

  const variance = samples.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / samples.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation = (stdDev / mean)
  // Consistency = max(0, 100 - (CV * 100))
  const cv = (stdDev / mean) * 100;
  const consistency = Math.max(10, Math.min(100, Math.round(100 - cv)));
  return consistency;
}

/**
 * Calculates a transparent, balanced performance score.
 * Rewards both speed and accuracy, with bonus for difficulty and consistency.
 */
export function calculateScore(
  wpm: number,
  accuracy: number,
  consistency: number,
  difficulty: Difficulty
): number {
  if (wpm <= 0) return 0;

  const difficultyMultiplier: Record<Difficulty, number> = {
    easy: 1.0,
    medium: 1.15,
    hard: 1.3,
  };

  const mult = difficultyMultiplier[difficulty] || 1.0;
  // If accuracy drops below 60%, severely penalize spamming
  const accuracyFactor = accuracy < 60 ? Math.pow(accuracy / 100, 2) : (accuracy / 100);
  const consistencyBonus = 1 + (consistency / 400); // Up to +25% bonus

  const rawScore = wpm * 10 * accuracyFactor * mult * consistencyBonus;
  return Math.max(0, Math.round(rawScore));
}

/**
 * Returns a descriptive rating label based on WPM and accuracy
 */
export function getPerformanceRating(wpm: number, accuracy: number): {
  tier: string;
  badgeColor: string;
  description: string;
} {
  if (wpm >= 120 && accuracy >= 97) {
    return { tier: 'GODLIKE', badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10', description: 'Top tier competitive speed and precision.' };
  }
  if (wpm >= 90 && accuracy >= 95) {
    return { tier: 'MASTER', badgeColor: 'text-brand border-brand/40 bg-brand/10', description: 'Exceptional speed and typing rhythm.' };
  }
  if (wpm >= 70 && accuracy >= 92) {
    return { tier: 'DIAMOND', badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', description: 'Advanced typist with great flow.' };
  }
  if (wpm >= 50 && accuracy >= 88) {
    return { tier: 'GOLD', badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', description: 'Solid above-average proficiency.' };
  }
  if (wpm >= 30) {
    return { tier: 'SILVER', badgeColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10', description: 'Good foundation with room for speed gains.' };
  }
  return { tier: 'NOVICE', badgeColor: 'text-slate-400 border-slate-500/40 bg-slate-500/10', description: 'Keep practicing to unlock faster speed!' };
}
