import { LeaderboardEntry, TestResult } from '../types/typing';
import { CloudTypingService } from './cloudTypingService';
import { isSupabaseConfigured } from './supabaseClient';

export interface LeaderboardFilterParams {
  timeframe: 'all-time' | 'weekly' | 'daily';
  testType: string;
  language: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'rank' | 'wpm' | 'accuracy' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export class LeaderboardService {
  /**
   * Fetches real shared leaderboard results from Supabase if online,
   * with fallback to verified local user test records.
   * NEVER returns fabricated or mock participants.
   */
  public static async getLeaderboardAsync(
    params: LeaderboardFilterParams,
    currentUserId?: string,
    userHistory: TestResult[] = [],
    currentUserDisplayName: string = 'You'
  ): Promise<{ entries: LeaderboardEntry[]; totalCount: number; page: number; totalPages: number; isCloud: boolean }> {
    if (isSupabaseConfigured()) {
      const cloudResult = await CloudTypingService.getLeaderboard({
        timeframe: params.timeframe,
        testType: params.testType,
        language: params.language,
        pageSize: params.pageSize || 20,
      });

      if (cloudResult.schemaReady && cloudResult.entries.length > 0) {
        const markedEntries = cloudResult.entries.map(e => ({
          ...e,
          isCurrentUser: Boolean(currentUserId && e.userId === currentUserId),
        }));

        return {
          entries: markedEntries,
          totalCount: markedEntries.length,
          page: 1,
          totalPages: 1,
          isCloud: true,
        };
      }
    }

    // Fallback to verified local user test records
    const local = this.getLeaderboard(params, userHistory, currentUserDisplayName);
    return {
      ...local,
      isCloud: false,
    };
  }

  /**
   * Retrieves verified leaderboard records based strictly on actual completed tests.
   */
  public static getLeaderboard(
    params: LeaderboardFilterParams,
    userHistory: TestResult[] = [],
    currentUserDisplayName: string = 'You'
  ): { entries: LeaderboardEntry[]; totalCount: number; page: number; totalPages: number } {
    const {
      timeframe = 'all-time',
      testType = 'time_15',
      page = 1,
      pageSize = 10,
      sortBy = 'wpm',
      sortOrder = 'desc',
    } = params;

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneWeekMs = 7 * oneDayMs;

    // Filter genuine user tests according to criteria
    const matchingTests = (userHistory || []).filter(h => {
      if (!h || h.wpm <= 0) return false;

      // Timeframe filter
      if (timeframe === 'daily' && now - h.timestamp > oneDayMs) return false;
      if (timeframe === 'weekly' && now - h.timestamp > oneWeekMs) return false;

      // Test type filter
      if (testType.startsWith('time_')) {
        const targetSec = parseInt(testType.replace('time_', ''), 10);
        return h.mode === 'time' && (h.duration === targetSec || !h.duration);
      }
      if (testType.startsWith('words_')) {
        const targetWords = parseInt(testType.replace('words_', ''), 10);
        return h.mode === 'words' && (h.wordCount === targetWords || !h.wordCount);
      }
      if (testType === 'quote') {
        return h.mode === 'quote';
      }

      return true;
    });

    if (matchingTests.length === 0) {
      return {
        entries: [],
        totalCount: 0,
        page: 1,
        totalPages: 1,
      };
    }

    // Map each actual test to a verified leaderboard record
    const realEntries: LeaderboardEntry[] = matchingTests.map(test => ({
      id: test.id,
      rank: 1,
      name: currentUserDisplayName || 'You',
      wpm: test.wpm,
      accuracy: test.accuracy,
      rawWpm: test.rawWpm,
      consistency: test.consistency || 0,
      date: new Date(test.timestamp).toISOString().split('T')[0],
      testType: test.mode === 'time' ? `Time ${test.duration || 30}s` : test.mode,
      duration: test.duration,
      language: test.dictLanguage || 'english',
      isCurrentUser: true,
    }));

    // Sort real entries
    realEntries.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'wpm') comparison = b.wpm - a.wpm;
      else if (sortBy === 'accuracy') comparison = b.accuracy - a.accuracy;
      else if (sortBy === 'date') comparison = b.date.localeCompare(a.date);
      else comparison = b.wpm - a.wpm;

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    // Assign sequential ranks
    const rankedEntries = realEntries.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));

    const totalCount = rankedEntries.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const pagedEntries = rankedEntries.slice(startIndex, startIndex + pageSize);

    return {
      entries: pagedEntries,
      totalCount,
      page: safePage,
      totalPages,
    };
  }
}
