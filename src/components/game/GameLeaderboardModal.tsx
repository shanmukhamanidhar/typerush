import React, { useState } from 'react';
import { Trophy, Medal, X, ShieldCheck, Flame, Zap, Clock } from 'lucide-react';
import { GameModeType, LeaderboardEntry, UserGameStats } from '../../types/game';

interface GameLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserGameStats;
  currentMode?: GameModeType;
}

export const GameLeaderboardModal: React.FC<GameLeaderboardModalProps> = ({
  isOpen,
  onClose,
  userStats,
  currentMode = 'falling-words',
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all-time' | 'weekly' | 'monthly'>('all-time');
  const [selectedMode, setSelectedMode] = useState<GameModeType>(currentMode);

  if (!isOpen) return null;

  // Base community leaderboard records
  const defaultEntries: LeaderboardEntry[] = [
    { id: 'lb-1', rank: 1, playerName: 'KRONOS_99', avatarStyle: 'orange', mode: 'falling-words', difficulty: 'insane', score: 64280, wpm: 154, accuracy: 99.4, maxCombo: 92, level: 16, date: '2026-09-20' },
    { id: 'lb-2', rank: 2, playerName: 'VORTEX_SPEED', avatarStyle: 'sunset', mode: 'falling-words', difficulty: 'hard', score: 58120, wpm: 142, accuracy: 98.7, maxCombo: 78, level: 14, date: '2026-09-21' },
    { id: 'lb-3', rank: 3, playerName: 'NEURAL_CHAMP', avatarStyle: 'sunset', mode: 'falling-words', difficulty: 'hard', score: 51940, wpm: 135, accuracy: 98.1, maxCombo: 65, level: 13, date: '2026-09-22' },
    { id: 'lb-4', rank: 4, playerName: 'SHADOW_KEY', avatarStyle: 'orange', mode: 'falling-words', difficulty: 'normal', score: 44350, wpm: 122, accuracy: 97.5, maxCombo: 54, level: 11, date: '2026-09-22' },
    { id: 'lb-5', rank: 5, playerName: 'CYBER_RACER', avatarStyle: 'sunset', mode: 'falling-words', difficulty: 'normal', score: 38200, wpm: 115, accuracy: 96.8, maxCombo: 47, level: 9, date: '2026-09-23' },
  ];

  // Insert user's personal best if available
  const userEntry: LeaderboardEntry | null = userStats.bestScore > 0 ? {
    id: 'user-lb',
    rank: 0,
    playerName: 'YOU (LOCAL)',
    avatarStyle: 'orange',
    mode: selectedMode,
    difficulty: 'normal',
    score: userStats.bestScore,
    wpm: userStats.bestWpm,
    accuracy: userStats.bestAccuracy,
    maxCombo: userStats.highestCombo,
    level: 8,
    date: 'Today',
    isUser: true,
  } : null;

  const combined = userEntry ? [...defaultEntries, userEntry] : defaultEntries;
  combined.sort((a, b) => b.score - a.score);
  combined.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111111] dark:text-white">
                ARCADE LEADERBOARD
              </h3>
              <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans">
                Global rankings & telemetry-verified scores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#080808]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-xs">
          <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#080808] p-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            {(['falling-words', 'time-attack', 'survival'] as GameModeType[]).map(m => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`px-3 py-1 rounded-md font-bold capitalize transition-all ${
                  selectedMode === m 
                    ? 'bg-[#FF5A00] text-black shadow-sm font-black' 
                    : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {m.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#080808] p-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            {(['all-time', 'weekly', 'monthly'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSelectedTimeframe(t)}
                className={`px-2.5 py-1 rounded-md font-bold capitalize transition-all ${
                  selectedTimeframe === t 
                    ? 'bg-[#FF6E1A]/20 text-[#FF6E1A] border border-[#FF6E1A]/40' 
                    : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {t.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-y-auto flex-1 my-3 pr-1 space-y-1.5">
          <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-[#666666] dark:text-[#71717A] px-3 py-1">
            <span className="col-span-1">RANK</span>
            <span className="col-span-4">PLAYER</span>
            <span className="col-span-2 text-right">SCORE</span>
            <span className="col-span-2 text-right">WPM</span>
            <span className="col-span-1 text-right">LVL</span>
            <span className="col-span-2 text-right">COMBO</span>
          </div>

          {combined.map(entry => {
            const rankBadgeColor = entry.rank === 1 ? 'text-[#FF5A00] bg-[#FF5A00]/10 border-[#FF5A00]/30' :
              entry.rank === 2 ? 'text-[#FF6E1A] bg-[#FF6E1A]/10 border-[#FF6E1A]/30' :
              entry.rank === 3 ? 'text-[#FFA347] bg-[#FFA347]/10 border-[#FFA347]/30' :
              'text-[#666666] dark:text-[#71717A] border-transparent';

            return (
              <div
                key={entry.id}
                className={`grid grid-cols-12 items-center px-3 py-2.5 rounded-lg border text-xs transition-all ${
                  entry.isUser 
                    ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-bold' 
                    : 'bg-[#F7F7F7] dark:bg-[#080808] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white'
                }`}
              >
                <div className="col-span-1 flex items-center">
                  <span className={`w-6 h-6 rounded-md border text-center leading-5 text-[11px] font-black ${rankBadgeColor}`}>
                    {entry.rank}
                  </span>
                </div>

                <div className="col-span-4 flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-md bg-[#FF5A00] text-black font-black text-[9px] flex items-center justify-center shrink-0">
                    {entry.playerName.slice(0, 1)}
                  </div>
                  <span className="truncate">{entry.playerName}</span>
                </div>

                <span className="col-span-2 text-right font-black text-[#FF5A00]">
                  {entry.score.toLocaleString()}
                </span>

                <span className="col-span-2 text-right text-[#111111] dark:text-white">
                  {entry.wpm}
                </span>

                <span className="col-span-1 text-right text-[#666666] dark:text-[#A1A1AA]">
                  {entry.level}
                </span>

                <span className="col-span-2 text-right font-bold text-[#FF6E1A]">
                  x{entry.maxCombo}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[11px] text-[#666666] dark:text-[#A1A1AA]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
            <span>Anti-cheat telemetry validation active</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] text-[#111111] dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] font-bold hover:border-[#FF5A00]/40"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
