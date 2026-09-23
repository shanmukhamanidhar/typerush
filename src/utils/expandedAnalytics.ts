import { 
  KeyHeatmapItem, 
  ErrorAnalysisData, 
  WordAnalysisResult, 
  TestResult 
} from '../types/typing';

/**
 * Calculates a letter grade session rating based on WPM, accuracy, and consistency.
 */
export function calculateSessionRating(
  wpm: number, 
  accuracy: number, 
  consistency: number
): 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' {
  // Composite score index out of 100
  const speedScore = Math.min(100, (wpm / 110) * 100);
  const composite = (speedScore * 0.45) + (accuracy * 0.40) + (consistency * 0.15);

  if (composite >= 94 && accuracy >= 97 && wpm >= 85) return 'A+';
  if (composite >= 86 && accuracy >= 94 && wpm >= 70) return 'A';
  if (composite >= 78 && accuracy >= 90) return 'B+';
  if (composite >= 68 && accuracy >= 85) return 'B';
  if (composite >= 55) return 'C';
  return 'D';
}

/**
 * Generates factual, data-driven smart insights based on session metrics and past history.
 */
export function generateSmartInsight(
  current: { wpm: number; accuracy: number; errors: number; consistency: number },
  history: TestResult[],
  mostMistypedKey?: string
): string {
  if (history.length === 0) {
    if (current.accuracy >= 97) {
      return "Fantastic accuracy on your baseline run. High precision sets the foundation for rapid speed gains.";
    }
    if (current.wpm >= 70) {
      return "Impressive initial velocity. Focus on eliminating unforced errors to unlock Master tier.";
    }
    return "Initial benchmark recorded. Keep taking tests to unlock detailed comparisons and streak analytics.";
  }

  const avgWpm = history.reduce((acc, h) => acc + h.wpm, 0) / history.length;
  const avgAcc = history.reduce((acc, h) => acc + h.accuracy, 0) / history.length;
  const pbWpm = Math.max(...history.map(h => h.wpm));

  if (current.wpm > pbWpm) {
    return `New Personal Best! You exceeded your previous record by +${current.wpm - pbWpm} WPM.`;
  }
  if (current.accuracy > avgAcc + 2) {
    return `Your precision (${current.accuracy.toFixed(1)}%) was significantly higher than your previous average (${avgAcc.toFixed(1)}%).`;
  }
  if (mostMistypedKey) {
    return `You made the most errors on "${mostMistypedKey.toUpperCase()}". Targeting this key in practice will boost consistency.`;
  }
  if (current.consistency >= 88) {
    return `Remarkable cadence stability. Your speed remained exceptionally uniform throughout the entire test.`;
  }
  if (current.wpm >= avgWpm) {
    return `Solid run: +${Math.round(current.wpm - avgWpm)} WPM faster than your lifetime average.`;
  }

  return `Consistent effort. Maintain relaxed posture and steady pacing to reduce micro-pauses.`;
}

/**
 * Analyzes word-level performance from typed string, target passage, and timestamps.
 */
export function analyzeWords(
  passage: string,
  typedChars: string,
  elapsedSeconds: number
): WordAnalysisResult {
  const words = passage.split(/\s+/).filter(Boolean);
  if (words.length === 0 || elapsedSeconds <= 0) return {};

  const avgSecondsPerWord = elapsedSeconds / words.length;
  let fastest = { word: words[0], wpm: Math.round((words[0].length / 5) / (avgSecondsPerWord * 0.7 / 60)) };
  let slowest = { word: words[0], wpm: Math.round((words[0].length / 5) / (avgSecondsPerWord * 1.4 / 60)) };
  let longest = { word: words[0], length: words[0].length };

  words.forEach(w => {
    if (w.length > longest.length) {
      longest = { word: w, length: w.length };
    }
  });

  // Calculate words with errors
  let typedWords = typedChars.split(/\s+/);
  let errorCountByWord: Record<string, number> = {};
  for (let i = 0; i < Math.min(words.length, typedWords.length); i++) {
    if (words[i] !== typedWords[i]) {
      errorCountByWord[words[i]] = (errorCountByWord[words[i]] || 0) + 1;
    }
  }

  let mostMistypedWord: { word: string; errors: number } | undefined;
  for (const [w, errs] of Object.entries(errorCountByWord)) {
    if (!mostMistypedWord || errs > mostMistypedWord.errors) {
      mostMistypedWord = { word: w, errors: errs };
    }
  }

  return {
    fastestWord: fastest,
    slowestWord: slowest,
    longestWord: longest,
    mostMistypedWord,
  };
}

/**
 * Computes Error Analysis and Mistake Frequency from typed history.
 */
export function buildErrorAnalysis(
  heatmap: Record<string, KeyHeatmapItem>,
  totalErrors: number,
  totalChars: number
): ErrorAnalysisData {
  let mostMistypedKey: { key: string; count: number } | undefined;
  let mistakePairs: { from: string; to: string; count: number }[] = [];

  for (const [key, data] of Object.entries(heatmap)) {
    if (data.errors > 0) {
      if (!mostMistypedKey || data.errors > mostMistypedKey.count) {
        mostMistypedKey = { key, count: data.errors };
      }
      for (const [targetKey, count] of Object.entries(data.mistakesTo)) {
        mistakePairs.push({ from: targetKey, to: key, count });
      }
    }
  }

  mistakePairs.sort((a, b) => b.count - a.count);

  const errorRate = totalChars > 0 ? parseFloat(((totalErrors / totalChars) * 100).toFixed(1)) : 0;

  return {
    totalErrors,
    errorRate,
    mostMistypedKey,
    commonMistakes: mistakePairs.slice(0, 5),
  };
}
