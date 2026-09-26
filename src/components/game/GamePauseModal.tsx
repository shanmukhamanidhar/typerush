import React, { useEffect } from 'react';
import { Play, RotateCcw, Home, Pause } from 'lucide-react';
import { GameHUDState } from '../../types/game';

interface GamePauseModalProps {
  isOpen: boolean;
  state: GameHUDState;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const GamePauseModal: React.FC<GamePauseModalProps> = ({
  isOpen,
  state,
  onResume,
  onRestart,
  onExit,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono"
      onClick={onResume}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] flex items-center justify-center mx-auto mb-4">
          <Pause className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-[#111111] dark:text-white tracking-wider mb-2">
          GAME PAUSED
        </h2>
        <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans mb-6">
          Words and timers are frozen. Catch your breath or adjust position.
        </p>

        {/* Quick Current Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] mb-6 text-xs">
          <div>
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">SCORE</span>
            <span className="font-black text-[#FF5A00]">{state.score.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">LEVEL</span>
            <span className="font-black text-[#111111] dark:text-white">{state.level}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block">MAX COMBO</span>
            <span className="font-black text-[#FF6E1A]">x{state.maxCombo}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 rounded-lg bg-[#FF5A00] text-black font-black text-xs uppercase tracking-wider hover:bg-[#FF6E1A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A00]/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME MISSION (ESC)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] text-[#111111] dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] font-bold text-xs uppercase tracking-wider hover:border-[#FF5A00]/40 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART GAME</span>
          </button>

          <button
            onClick={onExit}
            className="w-full py-2.5 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>EXIT TO GAME HUB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
