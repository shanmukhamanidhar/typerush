import React from 'react';
import { 
  Heart, 
  Shield, 
  Flame, 
  Zap, 
  Target, 
  Clock, 
  Pause, 
  Snowflake, 
  Hourglass, 
  Sparkles 
} from 'lucide-react';
import { GameHUDState, GameModeType } from '../../types/game';
import { getComboMultiplier, POWER_UP_CONFIG } from '../../utils/gameEngine';

interface GameHUDProps {
  state: GameHUDState;
  mode: GameModeType;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ state, mode, onPause }) => {
  const comboMult = getComboMultiplier(state.combo);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white/95 dark:bg-[#080808]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#2A2A2A] px-4 py-2.5 font-mono select-none shadow-sm z-30 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* LEFT: SCORE & HIGH SCORE */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] font-bold uppercase tracking-wider block">SCORE</span>
            <span className="text-xl font-black text-[#FF5A00] tracking-tight">
              {state.score.toLocaleString()}
            </span>
          </div>

          <div className="hidden sm:block border-l border-[#E5E5E5] dark:border-[#2A2A2A] pl-3">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold uppercase tracking-wider block">HIGH SCORE</span>
            <span className="text-sm font-bold text-[#111111] dark:text-white">
              {Math.max(state.highScore, state.score).toLocaleString()}
            </span>
          </div>
        </div>

        {/* CENTER: COMBO, LEVEL, WPM, ACCURACY */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* COMBO METER */}
          <div className="flex items-center gap-1.5 bg-[#F7F7F7] dark:bg-[#111111] px-2.5 py-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <Flame className={`w-4 h-4 ${state.combo >= 25 ? 'text-[#FF6E1A] animate-bounce' : state.combo >= 10 ? 'text-[#FF5A00]' : 'text-[#666666] dark:text-[#71717A]'}`} />
            <div>
              <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold block leading-none">COMBO</span>
              <span className={`text-xs font-black ${state.combo >= 25 ? 'text-[#FF6E1A]' : state.combo >= 10 ? 'text-[#FF5A00]' : 'text-[#111111] dark:text-white'}`}>
                x{state.combo} <span className="text-[10px] font-normal text-[#666666] dark:text-[#71717A]">({comboMult.toFixed(1)}x)</span>
              </span>
            </div>
          </div>

          {/* LEVEL */}
          {mode !== 'zen' && (
            <div className="text-center">
              <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold uppercase tracking-wider block">LEVEL</span>
              <span className="text-sm font-black px-2 py-0.5 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/40 text-[#FF5A00]">
                {state.level}
              </span>
            </div>
          )}

          {/* WPM */}
          <div className="text-center hidden sm:block">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold uppercase tracking-wider block">WPM</span>
            <span className="text-sm font-bold text-[#111111] dark:text-white">
              {state.wpm}
            </span>
          </div>

          {/* ACCURACY */}
          <div className="text-center hidden sm:block">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold uppercase tracking-wider block">ACCURACY</span>
            <span className="text-sm font-bold text-[#111111] dark:text-white">
              {state.accuracy.toFixed(1)}%
            </span>
          </div>

          {/* TIMER */}
          <div className="text-center">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-bold uppercase tracking-wider block">
              {mode === 'time-attack' ? 'TIME LEFT' : 'SURVIVED'}
            </span>
            <span className={`text-sm font-bold ${mode === 'time-attack' && (state.timeRemaining || 0) <= 10 ? 'text-[#FF3B5C] animate-pulse font-black' : 'text-[#111111] dark:text-white'}`}>
              {mode === 'time-attack' 
                ? formatSeconds(state.timeRemaining || 0) 
                : formatSeconds(state.timeElapsed)}
            </span>
          </div>
        </div>

        {/* RIGHT: LIVES & PAUSE */}
        <div className="flex items-center gap-3">
          
          {/* LIVES (Hidden in Zen Mode) */}
          {mode !== 'zen' && mode !== 'time-attack' && (
            <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#111111] px-2.5 py-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
              {Array.from({ length: state.maxLives }).map((_, i) => {
                const isActive = i < state.lives;
                return (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-300 ${
                      isActive 
                        ? 'text-[#FF3B5C] fill-[#FF3B5C] drop-shadow-[0_0_8px_rgba(255,59,92,0.6)]' 
                        : 'text-[#E5E5E5] dark:text-[#2A2A2A]'
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* PAUSE BUTTON */}
          <button
            onClick={onPause}
            className="p-1.5 rounded-lg bg-[#F7F7F7] dark:bg-[#111111] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF5A00]/40 transition-all flex items-center gap-1"
            title="Pause Game (or press Escape)"
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline font-bold">Pause</span>
          </button>
        </div>

      </div>

      {/* ACTIVE POWER-UPS TICKER */}
      {Object.entries(state.activePowerUps).some(([_, ms]) => (ms || 0) > 0) && (
        <div className="max-w-6xl mx-auto flex items-center gap-2 mt-2 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] text-[#666666] dark:text-[#A1A1AA] uppercase font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#FF5A00]" />
            Active Buffs:
          </span>
          <div className="flex items-center gap-2">
            {Object.entries(state.activePowerUps).map(([type, remainingMs]) => {
              if (!remainingMs || remainingMs <= 0) return null;
              const config = POWER_UP_CONFIG[type as keyof typeof POWER_UP_CONFIG];
              if (!config) return null;
              const sec = (remainingMs / 1000).toFixed(1);
              return (
                <span
                  key={type}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 shadow-sm"
                  style={{ 
                    backgroundColor: `${config.color}20`, 
                    borderColor: `${config.color}60`, 
                    color: config.color 
                  }}
                >
                  <span>{config.label}</span>
                  <span>({sec}s)</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
