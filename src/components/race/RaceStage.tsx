import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Zap, Target, AlertCircle, Clock, Flag } from 'lucide-react';
import { RaceRoom, TestResult } from '../../types/typing';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { useTimer } from '../../hooks/useTimer';
import { TypingArea } from '../TypingArea';
import { soundEngine } from '../../utils/audioSynth';

interface RaceStageProps {
  room: RaceRoom;
  localPlayerId: string;
  onUpdateProgress: (progress: number, wpm: number, accuracy: number) => void;
  onFinishRace: (wpm: number, accuracy: number) => void;
}

export const RaceStage: React.FC<RaceStageProps> = ({
  room,
  localPlayerId,
  onUpdateProgress,
  onFinishRace,
}) => {
  const [countdownNumber, setCountdownNumber] = useState<number | string>(3);
  const [isRacingStarted, setIsRacingStarted] = useState<boolean>(room.status === 'racing');

  const localPlayer = room.players[localPlayerId];
  const opponentId = Object.keys(room.players).find((id) => id !== localPlayerId);
  const opponent = opponentId ? room.players[opponentId] : null;

  // Countdown timer logic
  useEffect(() => {
    if (room.status === 'countdown' && room.startTimestamp) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((room.startTimestamp! - Date.now()) / 1000));
        if (remaining > 0) {
          setCountdownNumber(remaining);
          soundEngine.playCountdown(false);
        } else {
          setCountdownNumber('GO!');
          soundEngine.playCountdown(true);
          clearInterval(interval);
          setTimeout(() => {
            setIsRacingStarted(true);
          }, 400);
        }
      }, 250);

      return () => clearInterval(interval);
    } else if (room.status === 'racing') {
      setIsRacingStarted(true);
    }
  }, [room.status, room.startTimestamp]);

  // Hook typing engine to race passage
  const typingEngine = useTypingEngine({
    passage: room.passage,
    mode: room.testMode,
    duration: room.duration as any,
    difficulty: room.difficulty,
    category: room.category,
    onFinish: (result: TestResult) => {
      onFinishRace(result.wpm, result.accuracy);
    },
  });

  // Timer
  const timer = useTimer({
    initialDuration: room.duration,
    onTimeUp: () => {
      typingEngine.completeTest();
    },
  });

  // Start timer once racing starts
  useEffect(() => {
    if (isRacingStarted && !timer.isActive && !timer.isFinished) {
      timer.startTimer();
    }
  }, [isRacingStarted, timer]);

  // Throttle broadcast progress updates
  const lastBroadcastRef = useRef<number>(0);
  useEffect(() => {
    const now = Date.now();
    if (now - lastBroadcastRef.current > 150 || typingEngine.progress === 100) {
      lastBroadcastRef.current = now;
      onUpdateProgress(typingEngine.progress, typingEngine.wpm, typingEngine.accuracy);
    }
  }, [typingEngine.progress, typingEngine.wpm, typingEngine.accuracy, onUpdateProgress]);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 animate-fadeIn font-mono">
      
      {/* Synchronized 3-2-1-GO Fullscreen Overlay */}
      {room.status === 'countdown' && !isRacingStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="text-center animate-bounce">
            <span className="text-8xl sm:text-9xl font-black text-cyan-400 drop-shadow-[0_0_40px_rgba(0,240,255,0.6)]">
              {countdownNumber}
            </span>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">
              Get ready to race!
            </p>
          </div>
        </div>
      )}

      {/* 1v1 Head-to-Head Visual Track */}
      <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 mb-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Flag className="w-4 h-4 text-cyan-500" />
            <span>LIVE 1V1 RACE TRACK</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Room: {room.code}</span>
            <span className="text-cyan-400 font-bold">{timer.formattedTime}</span>
          </div>
        </div>

        {/* Local Player Track */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <span>{localPlayer?.name} (You)</span>
              {typingEngine.progress >= (opponent?.progress || 0) && (
                <span className="text-[9px] px-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  LEAD
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {typingEngine.wpm} WPM · {typingEngine.progress}%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-3.5 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-150 relative flex items-center justify-end pr-1"
              style={{ width: `${Math.max(4, typingEngine.progress)}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
          </div>
        </div>

        {/* Opponent Track */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <span>{opponent?.name || 'Opponent'}</span>
              {(opponent?.progress || 0) > typingEngine.progress && (
                <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  LEAD
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {opponent?.wpm || 0} WPM · {opponent?.progress || 0}%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-3.5 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-150 relative flex items-center justify-end pr-1"
              style={{ width: `${Math.max(4, opponent?.progress || 0)}%` }}
            >
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Typing Passage */}
      <TypingArea
        passage={room.passage}
        typedChars={typingEngine.typedChars}
        charStatuses={typingEngine.charStatuses}
        cursorStyle="line"
        isStarted={typingEngine.isStarted}
        isFinished={typingEngine.isFinished}
        pasteAttempted={typingEngine.pasteAttempted}
        onKeyDown={typingEngine.handleKeyDown}
        onPaste={typingEngine.handlePaste}
        onRestart={() => {}}
      />

      {/* Floating Status Banner */}
      <div className="mt-4 text-center text-xs text-slate-400">
        ⚡ 1v1 Realtime Synchronization via Supabase Realtime Channel
      </div>
    </div>
  );
};
