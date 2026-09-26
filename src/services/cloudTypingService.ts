import { supabase, isSupabaseConfigured } from './supabaseClient';
import { TestResult, PersonalBests, LeaderboardEntry } from '../types/typing';

export interface CloudLeaderboardParams {
  timeframe: 'all-time' | 'weekly' | 'daily';
  testType: string;
  language?: string;
  page?: number;
  pageSize?: number;
}

export class CloudTypingService {
  /**
   * Insert a verified completed typing test into Supabase typing_results
   */
  public static async saveResult(
    result: TestResult,
    userId: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Cloud database is not configured.' };
    }

    // Only save completed real tests with realistic human WPM (1-300)
    if (!result || result.wpm <= 0 || result.wpm > 300) {
      return { success: false, error: 'Invalid or incomplete test result.' };
    }

    try {
      const totalChars = result.totalChars || (result.wordCount ? result.wordCount * 5 : 100);
      const correctChars = result.correctChars ?? result.characterBreakdown?.correct ?? Math.round(totalChars * (result.accuracy / 100));
      const incorrectChars = result.incorrectChars ?? result.characterBreakdown?.incorrect ?? 0;

      const payload = {
        user_id: userId,
        wpm: result.wpm,
        raw_wpm: result.rawWpm || result.wpm,
        accuracy: result.accuracy,
        consistency: result.consistency || 85,
        characters: totalChars,
        correct_characters: correctChars,
        incorrect_characters: incorrectChars,
        mode: result.mode || 'time',
        duration: result.duration || 30,
        language: typeof result.language === 'string' ? result.language : 'english',
        punctuation: Boolean(result.punctuationEnabled),
        numbers: Boolean(result.numbersEnabled),
        created_at: new Date(result.timestamp || Date.now()).toISOString(),
      };

      const { data, error } = await supabase
        .from('typing_results')
        .insert(payload)
        .select('id')
        .single();

      if (error) {
        console.warn('[TypeRush] Failed to insert cloud typing result:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data?.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database write error';
      return { success: false, error: msg };
    }
  }

  /**
   * Fetch authenticated user's actual typing history from Supabase
   */
  public static async getUserHistory(userId: string): Promise<TestResult[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('typing_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error || !data) {
        return [];
      }

      return data.map((row: any): TestResult => {
        const wpmVal = Number(row.wpm);
        const accVal = Number(row.accuracy);
        const chars = row.characters || 100;
        const correct = row.correct_characters || Math.round(chars * (accVal / 100));
        const incorrect = row.incorrect_characters || 0;

        return {
          id: row.id,
          timestamp: new Date(row.created_at).getTime(),
          mode: row.mode || 'time',
          duration: row.duration || 30,
          wordCount: row.characters ? Math.round(row.characters / 5) : 25,
          difficulty: 'medium',
          category: 'general',
          wpm: wpmVal,
          rawWpm: row.raw_wpm ? Number(row.raw_wpm) : wpmVal,
          accuracy: accVal,
          consistency: row.consistency ? Number(row.consistency) : 85,
          errors: incorrect,
          correctChars: correct,
          incorrectChars: incorrect,
          totalChars: chars,
          characterBreakdown: {
            correct,
            incorrect,
            extra: 0,
            missed: 0,
          },
          score: Math.round(wpmVal * (accVal / 100)),
          sessionRating: wpmVal >= 100 ? 'A+' : wpmVal >= 80 ? 'A' : wpmVal >= 60 ? 'B+' : 'B',
          metricsHistory: [],
          passageSnippet: '',
          punctuationEnabled: Boolean(row.punctuation),
          numbersEnabled: Boolean(row.numbers),
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Compute authentic personal bests from Supabase results
   */
  public static calculatePersonalBests(history: TestResult[]): PersonalBests {
    const valid = (history || []).filter(h => h && h.wpm > 0 && h.wpm <= 280);

    const getBestFor = (predicate: (h: TestResult) => boolean): number => {
      const filtered = valid.filter(predicate).map(h => h.wpm);
      return filtered.length > 0 ? Math.max(...filtered) : 0;
    };

    const allWpms = valid.map(h => h.wpm);
    const allAccs = valid.map(h => h.accuracy);

    return {
      bestWpm: allWpms.length > 0 ? Math.max(...allWpms) : 0,
      bestAccuracy: allAccs.length > 0 ? Math.max(...allAccs) : 0,
      bestScore: 0,
      best15s: getBestFor(h => h.mode === 'time' && h.duration === 15),
      best30s: getBestFor(h => h.mode === 'time' && (h.duration === 30 || !h.duration)),
      best60s: getBestFor(h => h.mode === 'time' && h.duration === 60),
      best120s: getBestFor(h => h.mode === 'time' && h.duration === 120),
      bestWords10: getBestFor(h => h.mode === 'words' && h.wordCount === 10),
      bestWords25: getBestFor(h => h.mode === 'words' && (h.wordCount === 25 || !h.wordCount)),
      bestWords50: getBestFor(h => h.mode === 'words' && h.wordCount === 50),
      bestWords100: getBestFor(h => h.mode === 'words' && h.wordCount === 100),
      bestWords200: getBestFor(h => h.mode === 'words' && h.wordCount === 200),
    };
  }

  /**
   * Query real shared leaderboard from Supabase typing_results & profiles
   */
  public static async getLeaderboard(
    params: CloudLeaderboardParams
  ): Promise<{ entries: LeaderboardEntry[]; totalCount: number; schemaReady: boolean }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { entries: [], totalCount: 0, schemaReady: false };
    }

    const {
      timeframe = 'all-time',
      testType = 'time_15',
      language,
      pageSize = 20,
    } = params;

    try {
      let query = supabase
        .from('typing_results')
        .select(`
          id,
          wpm,
          raw_wpm,
          accuracy,
          consistency,
          mode,
          duration,
          language,
          punctuation,
          numbers,
          created_at,
          user_id,
          profiles (
            username,
            display_name
          )
        `)
        .order('wpm', { ascending: false })
        .order('accuracy', { ascending: false })
        .limit(pageSize * 3);

      // Mode / Duration filter
      if (testType.startsWith('time_')) {
        const sec = parseInt(testType.replace('time_', ''), 10);
        query = query.eq('mode', 'time').eq('duration', sec);
      } else if (testType.startsWith('words_')) {
        query = query.eq('mode', 'words');
      } else if (testType === 'quote') {
        query = query.eq('mode', 'quote');
      }

      // Language filter
      if (language && language !== 'all') {
        query = query.eq('language', language);
      }

      // Timeframe filter
      const now = new Date();
      if (timeframe === 'daily') {
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', yesterday);
      } else if (timeframe === 'weekly') {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', lastWeek);
      }

      const { data, error } = await query;

      if (error) {
        // Table not created yet or permission error
        return { entries: [], totalCount: 0, schemaReady: false };
      }

      if (!data || data.length === 0) {
        return { entries: [], totalCount: 0, schemaReady: true };
      }

      // Dedup best result per user so each user appears once with their personal best
      const userBestMap = new Map<string, any>();
      for (const row of data) {
        const uid = row.user_id;
        if (!userBestMap.has(uid) || Number(row.wpm) > Number(userBestMap.get(uid).wpm)) {
          userBestMap.set(uid, row);
        }
      }

      const uniqueRows = Array.from(userBestMap.values()).slice(0, pageSize);

      const entries: LeaderboardEntry[] = uniqueRows.map((row, index) => {
        const profile = row.profiles;
        const username = profile?.username || profile?.display_name || `racer_${row.user_id.slice(0, 5)}`;

        return {
          id: row.id,
          rank: index + 1,
          name: username,
          userId: row.user_id,
          username,
          wpm: Number(row.wpm),
          rawWpm: row.raw_wpm ? Number(row.raw_wpm) : Number(row.wpm),
          accuracy: Number(row.accuracy),
          consistency: row.consistency ? Number(row.consistency) : 85,
          date: new Date(row.created_at).toISOString(),
          testType: row.duration ? `${row.mode} ${row.duration}s` : row.mode,
          duration: row.duration,
          language: row.language || 'english',
          isCurrentUser: false,
        };
      });

      return {
        entries,
        totalCount: entries.length,
        schemaReady: true,
      };
    } catch {
      return { entries: [], totalCount: 0, schemaReady: false };
    }
  }

  /**
   * Migrate existing localStorage history into the user's Supabase account
   */
  public static async migrateLocalHistory(
    userId: string,
    localHistory: TestResult[]
  ): Promise<{ success: boolean; migratedCount: number; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, migratedCount: 0, error: 'Supabase is not configured.' };
    }

    const validTests = (localHistory || []).filter(h => h && h.wpm > 0 && h.wpm <= 280);
    if (validTests.length === 0) {
      return { success: true, migratedCount: 0 };
    }

    try {
      const records = validTests.map(h => {
        const totalChars = h.totalChars || (h.wordCount ? h.wordCount * 5 : 100);
        const correctChars = h.correctChars ?? h.characterBreakdown?.correct ?? Math.round(totalChars * (h.accuracy / 100));
        const incorrectChars = h.incorrectChars ?? h.characterBreakdown?.incorrect ?? 0;

        return {
          user_id: userId,
          wpm: h.wpm,
          raw_wpm: h.rawWpm || h.wpm,
          accuracy: h.accuracy,
          consistency: h.consistency || 85,
          characters: totalChars,
          correct_characters: correctChars,
          incorrect_characters: incorrectChars,
          mode: h.mode || 'time',
          duration: h.duration || 30,
          language: typeof h.language === 'string' ? h.language : 'english',
          punctuation: Boolean(h.punctuationEnabled),
          numbers: Boolean(h.numbersEnabled),
          created_at: new Date(h.timestamp || Date.now()).toISOString(),
        };
      });

      // Insert in chunks of 50 to avoid request size limits
      let migrated = 0;
      for (let i = 0; i < records.length; i += 50) {
        const chunk = records.slice(i, i + 50);
        const { error } = await supabase.from('typing_results').insert(chunk);
        if (!error) {
          migrated += chunk.length;
        } else {
          console.warn('[TypeRush] Migration chunk error:', error);
        }
      }

      return { success: true, migratedCount: migrated };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Migration failed';
      return { success: false, migratedCount: 0, error: msg };
    }
  }
}
