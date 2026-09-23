import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, LogOut, Award, CheckCircle2, Target, Gauge } from 'lucide-react';
import { RaceRoom } from '../../types/typing';

interface RaceResultsProps {
  room: RaceRoom;
  localPlayerId: string;
  onRequestRematch: () => void;
  onLeaveRoom: () => void;
}

export const RaceResults: React.FC<RaceResultsProps> = ({
  room,
  localPlayerId,
  onRequestRematch,
  onLeaveRoom,
}) => {
  const localPlayer = room.players[localPlayerId];
  const opponentId = Object.keys(room.players).find((id) => id !== localPlayerId);
  const opponent = opponentId ? room.players[opponentId] : null;

  const isWinner = localPlayer?.rank === 1 || (localPlayer && opponent && localPlayer.wpm >= opponent.wpm);

  useEffect(() => {
    if (isWinner) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ffd700', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isWinner]);

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 animate-fadeIn font-mono">
      <div className="bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        
        {/* Result Hero Banner */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/20 animate-bounce">
          <Trophy className="w-10 h-10 fill-current" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isWinner ? '1v1 RACE VICTORY!' : 'RACE COMPLETE'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1 mb-6">
          {isWinner ? 'You outpaced your opponent in speed and precision.' : 'Great competitive duel! Check the head-to-head metrics below.'}
        </p>

        {/* Head to Head Duel Matrix */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          
          {/* You */}
          <div className={`p-5 rounded-2xl border ${
            isWinner 
              ? 'bg-cyan-500/10 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30' 
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
              {isWinner ? '🥇 1ST PLACE' : '🥈 2ND PLACE'}
            </span>
            <div className="text-lg font-bold text-slate-900 dark:text-white truncate my-1">
              {localPlayer?.name} (You)
            </div>
            <div className="text-4xl font-extrabold text-cyan-500 my-2">
              {localPlayer?.wpm} <span className="text-sm text-slate-400">WPM</span>
            </div>
            <div className="text-xs text-slate-400">
              {localPlayer?.accuracy.toFixed(1)}% Accuracy
            </div>
          </div>

          {/* Opponent */}
          <div className={`p-5 rounded-2xl border ${
            !isWinner && opponent 
              ? 'bg-purple-500/10 border-purple-500/80 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30' 
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              {!isWinner ? '🥇 1ST PLACE' : '🥈 2ND PLACE'}
            </span>
            <div className="text-lg font-bold text-slate-900 dark:text-white truncate my-1">
              {opponent?.name || 'Opponent'}
            </div>
            <div className="text-4xl font-extrabold text-purple-400 my-2">
              {opponent?.wpm || 0} <span className="text-sm text-slate-400">WPM</span>
            </div>
            <div className="text-xs text-slate-400">
              {(opponent?.accuracy || 0).toFixed(1)}% Accuracy
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRequestRematch}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REMATCH (NEW PASSAGE)</span>
          </button>

          <button
            onClick={onLeaveRoom}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT TO MENU</span>
          </button>
        </div>

      </div>
    </div>
  );
};
