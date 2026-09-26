import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Trophy, Play, Globe, LogIn } from 'lucide-react';
import { TestResult, LeaderboardEntry } from '../../types/typing';
import { LeaderboardService } from '../../services/leaderboardService';
import { LeaderboardFilters } from './LeaderboardFilters';

interface LeaderboardPageProps {
  userHistory?: TestResult[];
  userDisplayName?: string;
  currentUserId?: string;
  isUserAuthenticated?: boolean;
  onOpenAuthModal?: () => void;
  onStartTest?: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  userHistory = [],
  userDisplayName = 'You',
  currentUserId,
  isUserAuthenticated = false,
  onOpenAuthModal,
  onStartTest,
}) => {
  const [timeframe, setTimeframe] = useState<'all-time' | 'weekly' | 'daily'>('all-time');
  const [testType, setTestType] = useState('time_15');
  const [language, setLanguage] = useState('english');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'rank' | 'wpm' | 'accuracy' | 'date'>('wpm');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isCloud, setIsCloud] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load real shared leaderboard records asynchronously
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    LeaderboardService.getLeaderboardAsync(
      {
        timeframe,
        testType,
        language,
        page,
        pageSize: 15,
        sortBy,
        sortOrder,
      },
      currentUserId,
      userHistory,
      userDisplayName
    ).then(res => {
      if (!isCancelled) {
        setEntries(res.entries);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages || 1);
        setIsCloud(res.isCloud);
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [timeframe, testType, language, page, sortBy, sortOrder, currentUserId, userHistory, userDisplayName]);

  const handleSort = (column: 'rank' | 'wpm' | 'accuracy' | 'date') => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formattedTestTitle = useMemo(() => {
    const tf = timeframe.toUpperCase();
    const lang = language.toUpperCase();
    const modeLabel = testType.replace('_', ' ').toUpperCase();
    return `${tf} ${lang} — ${modeLabel}`;
  }, [timeframe, language, testType]);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 select-none font-mono animate-fadeIn space-y-6 text-[#111111] dark:text-[#F5F5F5]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#222222]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FF5A00] font-semibold mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
            {isCloud && (
              <span className="text-[10px] text-[#646669] px-1.5 py-0.2 rounded border border-[#E5E5E5] dark:border-[#222222] inline-flex items-center gap-1 font-normal lowercase">
                <Globe className="w-2.5 h-2.5 text-[#FF5A00]" /> shared database
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {formattedTestTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {!isUserAuthenticated && onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00] text-xs font-bold transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Sign In to Submit</span>
            </button>
          )}

          {onStartTest && (
            <button
              onClick={onStartTest}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#FF5A00] hover:opacity-90 text-black font-semibold text-xs transition-opacity cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Start Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Notice Banner if not signed in */}
      {!isUserAuthenticated && (
        <div className="p-3 rounded-lg border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01] text-xs text-[#646669] flex items-center justify-between">
          <span>Sign in to verify and submit your typing test results to the global rankings.</span>
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="text-[#FF5A00] hover:underline font-bold cursor-pointer shrink-0 ml-2"
            >
              Sign In →
            </button>
          )}
        </div>
      )}

      {/* Filter Controls */}
      <LeaderboardFilters
        timeframe={timeframe}
        testType={testType}
        language={language}
        onSelectTimeframe={(tf) => {
          setTimeframe(tf);
          setPage(1);
        }}
        onSelectTestType={(tt) => {
          setTestType(tt);
          setPage(1);
        }}
        onSelectLanguage={(lang) => {
          setLanguage(lang);
          setPage(1);
        }}
      />

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E5E5] dark:border-[#222222] text-[#646669]">
              <th className="py-2.5 px-3 font-medium w-12 text-center">#</th>
              <th className="py-2.5 px-3 font-medium">name</th>
              <th 
                className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors"
                onClick={() => handleSort('wpm')}
              >
                <div className="flex items-center gap-1">
                  <span>wpm</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors"
                onClick={() => handleSort('accuracy')}
              >
                <div className="flex items-center gap-1">
                  <span>accuracy</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-medium">raw</th>
              <th className="py-2.5 px-3 font-medium">consistency</th>
              <th 
                className="py-2.5 px-3 font-medium cursor-pointer hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors text-right"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>date</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]/60 dark:divide-[#222222]/60">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-xs text-[#646669]">
                  Loading verified results...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="space-y-3 max-w-sm mx-auto">
                    <div className="text-xs uppercase tracking-wider font-bold text-[#FF5A00]">
                      NO VERIFIED RESULTS YET
                    </div>
                    <p className="text-xs text-[#646669]">
                      There are no qualifying results yet for this filter. Complete a typing test to establish your verified record.
                    </p>
                    {onStartTest && (
                      <button
                        onClick={onStartTest}
                        className="px-3.5 py-1.5 rounded bg-[#FF5A00] text-black font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer mt-2"
                      >
                        Start Test
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id || `${entry.userId}-${entry.rank}`}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-[#FF5A00]/10 text-[#FF5A00] font-semibold'
                      : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-[#111111] dark:text-[#E2E2E2]'
                  }`}
                >
                  <td className="py-3 px-3 text-center">
                    <span className="text-[#646669]">#{entry.rank}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{entry.name || '—'}</span>
                      {entry.isCurrentUser && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FF5A00] text-black font-bold uppercase">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#FF5A00]">
                    {entry.wpm > 0 ? entry.wpm.toFixed(1) : '—'}
                  </td>
                  <td className="py-3 px-3">
                    {entry.accuracy > 0 ? `${entry.accuracy.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-3 px-3 text-[#646669] dark:text-[#888888]">
                    {entry.rawWpm && entry.rawWpm > 0 ? entry.rawWpm.toFixed(1) : '—'}
                  </td>
                  <td className="py-3 px-3 text-[#646669] dark:text-[#888888]">
                    {entry.consistency && entry.consistency > 0 ? `${entry.consistency.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right text-[#646669] dark:text-[#888888]">
                    {entry.date ? entry.date.split('T')[0] : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {entries.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5] dark:border-[#222222] text-xs text-[#646669]">
          <span>
            Showing page {page} of {totalPages} ({totalCount} verified results)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-[#E5E5E5] dark:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-[#E5E5E5] dark:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
