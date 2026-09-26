import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Award, 
  Zap, 
  Flame, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Share2 
} from 'lucide-react';
import { GameResult } from '../../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  result: GameResult;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onExit: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  onPlayAgain,
  onViewLeaderboard,
  onExit,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    if (result.isNewHighScore || result.score >= 5000) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5A00', '#FF6E1A', '#FF6E1A', '#FFA347'],
        });
      } catch {
        // Failsafe
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onPlayAgain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, result, onPlayAgain]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Trophy & Title */}
        <div className="w-14 h-14 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FF5A00]/20">
          <Trophy className="w-7 h-7" />
        </div>

        <h2 className="text-3xl font-black text-[#111111] dark:text-white tracking-wider">
          GAME OVER
        </h2>

        {result.isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/40 text-xs font-bold mt-2 animate-bounce">
            <span>🏆 NEW PERSONAL BEST!</span>
          </div>
        )}

        {/* Score Card */}
        <div className="my-5 p-5 bg-[#F7F7F7] dark:bg-[#080808] rounded-xl border border-[#FF5A00]/40 shadow-inner">
          <span className="text-xs font-bold text-[#666666] dark:text-[#A1A1AA] uppercase tracking-widest block mb-1">
            FINAL SCORE
          </span>
          <span className="text-5xl font-black text-[#FF5A00] tracking-tight block">
            {result.score.toLocaleString()}
          </span>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs font-bold text-[#FF6E1A]">
            <Zap className="w-4 h-4 fill-current" />
            <span>+{result.xpEarned} XP EARNED</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs">
          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">WPM</span>
            <span className="text-base font-black text-[#111111] dark:text-white">{result.wpm}</span>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">ACCURACY</span>
            <span className="text-base font-black text-[#111111] dark:text-white">{result.accuracy.toFixed(1)}%</span>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">MAX COMBO</span>
            <span className="text-base font-black text-[#FF6E1A]">x{result.maxCombo}</span>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">LEVEL</span>
            <span className="text-base font-black text-[#FF5A00]">{result.level}</span>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">WORDS TYPED</span>
            <span className="text-base font-black text-[#FF5A00]">{result.wordsTyped}</span>
          </div>

          <div className="p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">WORDS MISSED</span>
            <span className="text-base font-black text-[#FF3B5C]">{result.wordsMissed}</span>
          </div>

          <div className="col-span-2 p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">TIME SURVIVED</span>
            <span className="text-base font-black text-[#111111] dark:text-white">{formatSeconds(result.timeSurvivedSeconds)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-lg bg-[#FF5A00] text-black font-black text-xs uppercase tracking-wider hover:bg-[#FF6E1A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN (ENTER)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onViewLeaderboard}
              className="py-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] text-[#111111] dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] font-bold text-xs uppercase tracking-wider hover:border-[#FF5A00]/40 transition-all flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-[#FF6E1A]" />
              <span>LEADERBOARD</span>
            </button>

            <button
              onClick={onExit}
              className="py-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] font-bold text-xs uppercase tracking-wider hover:border-[#FF5A00]/40 transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>GAME HUB</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
