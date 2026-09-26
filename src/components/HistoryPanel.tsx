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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111111] dark:text-[#F5F5F5]">
              Searchable Test History
            </h2>
            <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] font-sans">
              {history.length} completed sessions recorded locally
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF3B5C] hover:bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 transition-all"
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
                className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${
                  filterMode === m
                    ? 'bg-[#FF5A00] text-black border-[#FF5A00] shadow-sm font-black'
                    : 'bg-[#F7F7F7] dark:bg-[#161616] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Search & Sort Dropdowns */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B6B6B] dark:text-[#71717A]" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#FF5A00] font-sans"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-bold text-[#111111] dark:text-white focus:outline-none focus:border-[#FF5A00]"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#151515] border border-[#E5E5E5] dark:border-[#222222] rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 text-[#FF3B5C] mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-[#111111] dark:text-white">
                Clear all test history?
              </h3>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mb-6 font-sans leading-relaxed">
              This will permanently delete all your recorded typing sessions and personal scores. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#666666] dark:text-[#A1A1AA] hover:bg-[#F7F7F7] dark:hover:bg-[#0A0A0A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#FF3B5C] hover:brightness-110 text-white transition-colors"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="w-full text-center py-16 px-4 bg-white dark:bg-[#111111] border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/30 flex items-center justify-center mb-4">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-2">
            {history.length === 0 ? 'No previous tests yet' : 'No matching sessions found'}
          </h3>
          <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1AA] font-sans max-w-md mx-auto mb-6">
            {history.length === 0
              ? 'Complete your first typing test to start building your performance history and tracking personal bests.'
              : 'Try clearing the search query or changing your mode filter to view more sessions.'}
          </p>
          {history.length === 0 && (
            <button
              onClick={onStartTest}
              className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-black bg-[#FF5A00] hover:bg-[#FF6E1A] shadow-lg shadow-[#FF5A00]/25 transition-all inline-flex items-center gap-2"
            >
              <span>START TEST</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* History Table */
        <div className="w-full bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F7F7] dark:bg-[#0A0A0A] text-[11px] font-mono uppercase tracking-wider text-[#6B6B6B] dark:text-[#71717A] border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
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
              <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A] font-mono text-xs">
                {filteredHistory.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-[#F7F7F7] dark:hover:bg-[#161616] transition-colors"
                  >
                    <td className="py-3 px-4 text-[#6B6B6B] dark:text-[#A1A1AA] whitespace-nowrap">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#111111] dark:text-white uppercase">
                        {item.mode} {item.wordCount ? `(${item.wordCount}w)` : item.duration ? `(${item.duration}s)` : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                        item.difficulty === 'easy'
                          ? 'text-[#FF6E1A] bg-[#FF6E1A]/10 border-[#FF6E1A]/30'
                          : item.difficulty === 'medium'
                          ? 'text-[#FF6E1A] bg-[#FF6E1A]/10 border-[#FF6E1A]/30'
                          : 'text-[#FF3B5C] bg-[#FF3B5C]/10 border-[#FF3B5C]/30'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-[#FF5A00] text-sm glow-orange">
                      {item.wpm}
                    </td>
                    <td className="py-3 px-4 text-right text-[#111111] dark:text-white font-bold">
                      {item.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right font-black text-[#FF6E1A]">
                      {item.sessionRating || 'B+'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#111111] dark:text-white">
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
