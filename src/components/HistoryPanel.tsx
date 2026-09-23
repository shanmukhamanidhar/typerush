import React, { useState, useMemo } from 'react';
import { History, Trash2, ArrowRight, Clock, AlertTriangle, Search, Filter, ArrowUpDown } from 'lucide-react';
import { TestResult, TestMode } from '../types/typing';

interface HistoryPanelProps {
  history: TestResult[];
  onClearHistory: () => void;
  onStartTest: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onStartTest,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'wpm' | 'acc' | 'score'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter & Sort History
  const filteredHistory = useMemo(() => {
    let list = [...history];

    // Mode filter
    if (filterMode !== 'all') {
      list = list.filter((h) => h.mode === filterMode);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.category.toLowerCase().includes(q) ||
          h.difficulty.toLowerCase().includes(q) ||
          h.passageSnippet.toLowerCase().includes(q) ||
          h.language?.toLowerCase().includes(q) ||
          h.quoteAuthor?.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      if (sortBy === 'wpm') return b.wpm - a.wpm;
      if (sortBy === 'acc') return b.accuracy - a.accuracy;
      if (sortBy === 'score') return b.score - a.score;
      return 0;
    });

    return list;
  }, [history, filterMode, sortBy, searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 animate-fadeIn font-mono">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Searchable Test History
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              {history.length} completed sessions recorded locally
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Sort Toolbar */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 text-xs">
          
          {/* Mode Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['all', 'time', 'words', 'quote', 'code', 'daily'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-3 py-1.5 rounded-lg border font-bold uppercase ${
                  filterMode === m
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Search & Sort Dropdowns */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="wpm">Highest WPM</option>
              <option value="acc">Highest Accuracy</option>
              <option value="score">Highest Score</option>
            </select>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 text-rose-500 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Clear all test history?
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-sans leading-relaxed">
              This will permanently delete all your recorded typing sessions and personal scores. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="w-full text-center py-16 px-4 bg-white dark:bg-[#0f172a]/60 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center mb-4">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {history.length === 0 ? 'No previous tests yet' : 'No matching sessions found'}
          </h3>
          <p className="text-sm text-slate-400 font-sans max-w-md mx-auto mb-6">
            {history.length === 0
              ? 'Complete your first typing test to start building your performance history and tracking personal bests.'
              : 'Try clearing the search query or changing your mode filter to view more sessions.'}
          </p>
          {history.length === 0 && (
            <button
              onClick={onStartTest}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/25 transition-all inline-flex items-center gap-2"
            >
              <span>START TEST</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* History Table */
        <div className="w-full bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">WPM</th>
                  <th className="py-3 px-4 text-right">Accuracy</th>
                  <th className="py-3 px-4 text-right">Rating</th>
                  <th className="py-3 px-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
                {filteredHistory.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-300 uppercase">
                        {item.mode} {item.wordCount ? `(${item.wordCount}w)` : item.duration ? `(${item.duration}s)` : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-medium ${
                        item.difficulty === 'easy'
                          ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                          : item.difficulty === 'medium'
                          ? 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
                          : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-cyan-400 text-sm">
                      {item.wpm}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-200">
                      {item.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400">
                      {item.sessionRating || 'B+'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
