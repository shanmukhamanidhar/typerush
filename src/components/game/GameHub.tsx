import React, { useState } from 'react';
import { 
  Gamepad2, 
  Flame, 
  Trophy, 
  Zap, 
  Clock, 
  Target, 
  Sparkles, 
  Layers, 
  Play, 
  Star,
  Award,
  Shield,
  Activity,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { GameModeType, GameDifficulty, UserGameStats } from '../../types/game';

interface GameHubProps {
  userStats: UserGameStats;
  onLaunchGame: (mode: GameModeType, difficulty: GameDifficulty) => void;
  onOpenLeaderboard: () => void;
}

export const GameHub: React.FC<GameHubProps> = ({
  userStats,
  onLaunchGame,
  onOpenLeaderboard,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('normal');

  const gameModes: {
    id: GameModeType;
    title: string;
    tagline: string;
    description: string;
    difficultyStars: number;
    badge: string;
    badgeColor: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'falling-words',
      title: 'FALLING WORDS',
      tagline: 'TYPE. SURVIVE. MASTER.',
      description: 'Words plummet from orbit. Type them before they hit the impact horizon. Collect power-ups, trigger combo multipliers, and survive escalating levels.',
      difficultyStars: 3,
      badge: 'POPULAR',
      badgeColor: 'text-[#FF5A00] bg-[#FF5A00]/15 border-[#FF5A00]/40',
      icon: <Flame className="w-5 h-5 text-[#FF5A00]" />,
    },
    {
      id: 'time-attack',
      title: 'TIME ATTACK',
      tagline: 'MAXIMUM VELOCITY SPRINT',
      description: 'Race against the countdown clock. Type as many words as humanly possible before the timer runs out. Zero life loss penalty.',
      difficultyStars: 4,
      badge: 'INTENSE',
      badgeColor: 'text-[#FFA347] bg-[#FFA347]/15 border-[#FFA347]/40',
      icon: <Clock className="w-5 h-5 text-[#FFA347]" />,
    },
    {
      id: 'survival',
      title: 'SURVIVAL',
      tagline: 'INFINITE HARDCORE CHALLENGE',
      description: 'Relentless acceleration. Falling speeds increase continuously and advanced technical terms appear. How long can you hold the line?',
      difficultyStars: 5,
      badge: 'HARDCORE',
      badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/40',
      icon: <Zap className="w-5 h-5 text-rose-400" />,
    },
    {
      id: 'zen',
      title: 'ZEN FLOW',
      tagline: 'MEDITATIVE TYPING VOYAGE',
      description: 'Calm, continuous typing without lives, fail conditions, or time pressure. Just smooth falling words and gentle particle feedback.',
      difficultyStars: 2,
      badge: 'RELAX',
      badgeColor: 'text-[#FF6E1A] bg-[#FF6E1A]/15 border-[#FF6E1A]/40',
      icon: <Sparkles className="w-5 h-5 text-[#FF6E1A]" />,
    },
  ];

  const difficulties: { id: GameDifficulty; label: string; desc: string }[] = [
    { id: 'easy', label: 'Easy', desc: 'Slower velocity' },
    { id: 'normal', label: 'Normal', desc: 'Standard speed' },
    { id: 'hard', label: 'Hard', desc: 'Fast words' },
    { id: 'insane', label: 'Insane', desc: 'Max speed' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 font-mono animate-fadeIn select-none">
      
      {/* Top Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/30 mb-3">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>ARCADE GAMING SECTOR</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#111111] dark:text-white tracking-tight mb-2 font-sans">
          TYPING <span className="text-[#FF5A00]">GAMES</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA] max-w-xl mx-auto leading-relaxed font-sans">
          Speed. Precision. Survival. Test your keyboard reflexes under arcade mechanics, combos, and dynamic power-up drops.
        </p>
      </div>

      {/* User Stats Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] uppercase font-bold block mb-1">GAMES</span>
          <span className="text-xl font-black text-[#111111] dark:text-white">{userStats.gamesPlayed}</span>
        </div>

        <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] uppercase font-bold block mb-1">BEST SCORE</span>
          <span className="text-xl font-black text-[#FF5A00]">{userStats.bestScore.toLocaleString()}</span>
        </div>

        <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] uppercase font-bold block mb-1">BEST WPM</span>
          <span className="text-xl font-black text-[#111111] dark:text-white">{userStats.bestWpm}</span>
        </div>

        <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] uppercase font-bold block mb-1">ACCURACY</span>
          <span className="text-xl font-black text-[#111111] dark:text-white">
            {userStats.bestAccuracy > 0 ? `${userStats.bestAccuracy.toFixed(1)}%` : '—'}
          </span>
        </div>

        <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] uppercase font-bold block mb-1">MAX COMBO</span>
          <span className="text-xl font-black text-[#FF6E1A]">x{userStats.highestCombo}</span>
        </div>

        <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] uppercase font-bold block mb-1">WORDS</span>
          <span className="text-xl font-black text-[#111111] dark:text-white">{userStats.totalWords.toLocaleString()}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between">
          <span className="text-[10px] text-[#FF6E1A] uppercase font-bold block mb-1 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            TOTAL XP
          </span>
          <span className="text-xl font-black text-[#FF6E1A]">{userStats.totalXp.toLocaleString()}</span>
        </div>
      </div>

      {/* Top Controls: Difficulty & Leaderboard CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        
        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#666666] dark:text-[#A1A1AA]">Difficulty:</span>
          <div className="flex items-center bg-white dark:bg-[#111111] p-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs">
            {difficulties.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  selectedDifficulty === d.id
                    ? 'bg-[#FF5A00] text-black font-black shadow-xs'
                    : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
                title={d.desc}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Leaderboard Button */}
        <button
          onClick={onOpenLeaderboard}
          className="px-4 py-2 rounded-lg bg-[#FF6E1A]/10 text-[#FF6E1A] border border-[#FF6E1A]/35 hover:bg-[#FF6E1A]/20 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Trophy className="w-4 h-4" />
          <span>VIEW LEADERBOARD</span>
        </button>

      </div>

      {/* Game Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {gameModes.map(game => {
          const modeStats = userStats.modeStats[game.id];
          return (
            <div
              key={game.id}
              className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 shadow-xs flex flex-col justify-between relative group hover:border-[#FF5A00]/40 transition-all duration-200"
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#111111] dark:text-white tracking-wide">
                        {game.title}
                      </h3>
                      <span className="text-[10px] text-[#FF5A00] font-bold block tracking-wider">
                        {game.tagline}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Difficulty Stars */}
                <div className="flex items-center gap-3 text-xs mb-5">
                  <span className="text-[#666666] dark:text-[#A1A1AA]">Difficulty:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < game.difficultyStars 
                            ? 'text-[#FF5A00] fill-[#FF5A00]' 
                            : 'text-[#E5E5E5] dark:text-[#333333]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Play Button */}
              <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] block">Personal Best</span>
                  <span className="text-sm font-black text-[#FF5A00]">
                    {modeStats?.bestScore ? `${modeStats.bestScore.toLocaleString()} pts` : 'No runs yet'}
                  </span>
                </div>

                <button
                  onClick={() => onLaunchGame(game.id, selectedDifficulty)}
                  className="px-6 py-2.5 rounded-lg bg-[#FF5A00] text-black font-black text-xs uppercase tracking-wider hover:bg-[#FF6E1A] shadow-[0_0_15px_rgba(255,90,0,0.20)] flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY NOW</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Match History Table */}
      {userStats.history.length > 0 && (
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF5A00]" />
              <span>Recent Game Sessions</span>
            </h3>
            <span className="text-xs text-[#666666] dark:text-[#A1A1AA]">
              {userStats.history.length} Matches Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-[10px] uppercase font-bold text-[#666666] dark:text-[#A1A1AA]">
                  <th className="py-2 px-3">Mode</th>
                  <th className="py-2 px-3">Difficulty</th>
                  <th className="py-2 px-3 text-right">Score</th>
                  <th className="py-2 px-3 text-right">WPM</th>
                  <th className="py-2 px-3 text-right">Accuracy</th>
                  <th className="py-2 px-3 text-right">Max Combo</th>
                  <th className="py-2 px-3 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
                {userStats.history.slice(0, 5).map(match => (
                  <tr key={match.id} className="hover:bg-[#F7F7F7] dark:hover:bg-[#080808] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#FF5A00] capitalize">
                      {match.mode.replace('-', ' ')}
                    </td>
                    <td className="py-2.5 px-3 text-[#666666] dark:text-[#A1A1AA] capitalize">
                      {match.difficulty}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-[#111111] dark:text-white">
                      {match.score.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#111111] dark:text-[#A1A1AA]">
                      {match.wpm}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#111111] dark:text-[#A1A1AA]">
                      {match.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#FF6E1A]">
                      x{match.maxCombo}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#FF5A00]">
                      +{match.xpEarned}
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
