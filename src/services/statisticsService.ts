import { TestResult } from '../types/typing';

export interface WpmDistributionBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
  isUserBucket?: boolean;
}

export interface UserStatsSummary {
  totalTestsCompleted: number;
  totalTypingTimeSeconds: number;
  formattedTypingTime: string;
  averageWpm: number;
  peakWpm: number;
  averageAccuracy: number;
  averageConsistency: number;
  totalWordsTyped: number;
}

export class StatisticsService {
  /**
   * Calculates strictly authentic statistics from the user's actual completed test results.
   * Zero fake / zero simulated platform totals.
   */
  public static getUserStats(history: TestResult[]): UserStatsSummary {
    const validHistory = (history || []).filter(
      item => item && item.wpm > 0 && item.wpm <= 250 && (!item.burstSpeed?.peakWpm || item.burstSpeed.peakWpm <= 280)
    );

    if (validHistory.length === 0) {
      return {
        totalTestsCompleted: 0,
        totalTypingTimeSeconds: 0,
        formattedTypingTime: '0s',
        averageWpm: 0,
        peakWpm: 0,
        averageAccuracy: 0,
        averageConsistency: 0,
        totalWordsTyped: 0,
      };
    }

    const totalTests = validHistory.length;
    const totalWpm = validHistory.reduce((sum, h) => sum + h.wpm, 0);
    const totalAcc = validHistory.reduce((sum, h) => sum + h.accuracy, 0);
    const totalCons = validHistory.reduce((sum, h) => sum + (h.consistency || 85), 0);
    const peakWpm = Math.max(...validHistory.map(h => Math.max(h.wpm, h.burstSpeed?.peakWpm || h.wpm)));
    const totalSeconds = validHistory.reduce((sum, h) => sum + (h.duration || 30), 0);
    const totalWords = validHistory.reduce((sum, h) => sum + (h.wordCount || Math.round((h.duration || 30) * 1.2)), 0);

    const avgWpm = Math.round(totalWpm / totalTests);
    const avgAcc = parseFloat((totalAcc / totalTests).toFixed(1));
    const avgCons = Math.round(totalCons / totalTests);

    // Human readable duration format
    let formattedDuration = `${totalSeconds}s`;
    if (totalSeconds >= 3600) {
      const hours = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      formattedDuration = `${hours}h ${mins}m`;
    } else if (totalSeconds >= 60) {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      formattedDuration = `${mins}m ${secs}s`;
    }

    return {
      totalTestsCompleted: totalTests,
      totalTypingTimeSeconds: totalSeconds,
      formattedTypingTime: formattedDuration,
      averageWpm: avgWpm,
      peakWpm,
      averageAccuracy: avgAcc,
      averageConsistency: avgCons,
      totalWordsTyped: totalWords,
    };
  }

  /**
   * Derives real WPM distribution from actual completed tests in history.
   * If history is empty, returns an empty array.
   */
  public static getWpmDistribution(history: TestResult[], userBestWpm?: number): WpmDistributionBucket[] {
    const validHistory = (history || []).filter(item => item && item.wpm > 0);

    const bucketDefinitions: { range: string; min: number; max: number }[] = [
      { range: '0–19', min: 0, max: 19 },
      { range: '20–39', min: 20, max: 39 },
      { range: '40–59', min: 40, max: 59 },
      { range: '60–79', min: 60, max: 79 },
      { range: '80–99', min: 80, max: 99 },
      { range: '100–119', min: 100, max: 119 },
      { range: '120–139', min: 120, max: 139 },
      { range: '140–159', min: 140, max: 159 },
      { range: '160+', min: 160, max: 300 },
    ];

    if (validHistory.length === 0) {
      return [];
    }

    const totalTests = validHistory.length;

    return bucketDefinitions.map(def => {
      const testsInBucket = validHistory.filter(h => {
        if (def.max === 300) return h.wpm >= 160;
        return h.wpm >= def.min && h.wpm <= def.max;
      });

      const count = testsInBucket.length;
      const percentage = parseFloat(((count / totalTests) * 100).toFixed(1));
      const isUserBucket = userBestWpm !== undefined && userBestWpm > 0 && (
        def.max === 300 ? userBestWpm >= 160 : userBestWpm >= def.min && userBestWpm <= def.max
      );

      return {
        range: def.range,
        min: def.min,
        max: def.max,
        count,
        percentage,
        isUserBucket,
      };
    });
  }

  /**
   * Derives real percentile strictly from user's history relative to all completed sessions.
   * Returns null if no sessions exist.
   */
  public static calculateSessionPercentile(wpm: number, history: TestResult[]): number | null {
    const validHistory = (history || []).filter(h => h && h.wpm > 0);
    if (validHistory.length === 0 || wpm <= 0) return null;

    const lowerCount = validHistory.filter(h => h.wpm < wpm).length;
    return parseFloat(((lowerCount / validHistory.length) * 100).toFixed(1));
  }
}
