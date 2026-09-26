import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Flag, WifiOff, Radio } from 'lucide-react';
import { RaceRoom, TestResult } from '../../types/typing';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { useTimer } from '../../hooks/useTimer';
import { TypingArea } from '../TypingArea';
import { soundEngine } from '../../utils/audioSynth';

interface RaceStageProps {
  room: RaceRoom;
  localPlayerId: string;
  onUpdateProgress: (progress: number, wpm: number, accuracy: number, second?: number) => void;
  onFinishRace: (wpm: number, accuracy: number, metricsHistory?: { second: number; wpm: number; accuracy?: number }[]) => void;
}

export const RaceStage: React.FC<RaceStageProps> = ({
  room,
  localPlayerId,
  onUpdateProgress,
  onFinishRace,
}) => {
  const [countdownNumber, setCountdownNumber] = useState<number | string>(3);
  const [isRacingStarted, setIsRacingStarted] = useState<boolean>(room.status === 'racing');

  const allPlayers = Object.values(room.players);

  // Synchronized countdown logic
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
          }, 350);
        }
      }, 200);

      return () => clearInterval(interval);
    } else if (room.status === 'racing') {
      setIsRacingStarted(true);
    }
  }, [room.status, room.startTimestamp]);

  // Hook typing engine to identical race passage
  const typingEngine = useTypingEngine({
    passage: room.passage,
    mode: room.testMode,
    duration: room.duration as any,
    difficulty: room.difficulty,
    category: room.category,
    onFinish: (result: TestResult) => {
      onFinishRace(result.wpm, result.accuracy, result.metricsHistory);
    },
  });

  // Timer
  const timer = useTimer({
    initialDuration: room.duration,
    onTimeUp: () => {
      typingEngine.completeTest();
    },
  });

  // Start timer once countdown ends
  useEffect(() => {
    if (isRacingStarted && !timer.isActive && !timer.isFinished) {
      timer.startTimer();
    }
  }, [isRacingStarted, timer]);

  // Throttle broadcast progress updates (every 140ms or on completion)
  const lastBroadcastRef = useRef<number>(0);
  useEffect(() => {
    const now = Date.now();
    if (now - lastBroadcastRef.current > 140 || typingEngine.progress === 100) {
      lastBroadcastRef.current = now;
      const elapsed = Math.max(1, timer.elapsedSeconds);
      onUpdateProgress(typingEngine.progress, typingEngine.wpm, typingEngine.accuracy, elapsed);
    }
  }, [typingEngine.progress, typingEngine.wpm, typingEngine.accuracy, timer.elapsedSeconds, room.duration, onUpdateProgress]);

  // Ranked competitors sorted by progress (descending) and then WPM
  const rankedPlayers = useMemo(() => {
    return [...allPlayers].sort((a, b) => {
      if (a.isFinished && b.isFinished) {
        return (a.rank || 99) - (b.rank || 99);
      }
      if (a.isFinished) return -1;
      if (b.isFinished) return 1;

      const progA = a.id === localPlayerId ? typingEngine.progress : a.progress;
      const progB = b.id === localPlayerId ? typingEngine.progress : b.progress;
      if (progA !== progB) return progB - progA;

      const wpmA = a.id === localPlayerId ? typingEngine.wpm : a.wpm;
      const wpmB = b.id === localPlayerId ? typingEngine.wpm : b.wpm;
      return wpmB - wpmA;
    });
  }, [allPlayers, localPlayerId, typingEngine.progress, typingEngine.wpm]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 font-mono select-none animate-fadeIn text-[#111111] dark:text-[#F5F5F5]">
      
      {/* Synchronized 3-2-1-GO Minimal Fullscreen Overlay */}
      {room.status === 'countdown' && !isRacingStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
          <div className="text-center font-mono">
            <span className="text-8xl sm:text-9xl font-black text-[#FF5A00] block mb-2">
              {countdownNumber}
            </span>
            <p className="text-xs uppercase tracking-widest text-[#646669] dark:text-[#A1A1A1]">
              Synchronizing with opponents
            </p>
          </div>
        </div>
      )}

      {/* Realtime Competitor Progress Track */}
      <div className="mb-8 p-5 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E5E5] dark:border-[#222222] text-xs">
          <div className="flex items-center gap-2 font-bold">
            <Flag className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span className="uppercase text-[11px] tracking-wider">Live Race Track</span>
            <span className="text-[10px] text-[#646669]">({allPlayers.length} racers)</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#646669]">ROOM: <strong className="text-[#FF5A00]">{room.code}</strong></span>
            <span className="text-[#FF5A00] font-black text-sm">{timer.formattedTime}</span>
          </div>
        </div>

        {/* Lanes */}
        <div className="space-y-3">
          {allPlayers.map((player) => {
            const isLocal = player.id === localPlayerId;
            const currentProgress = isLocal ? typingEngine.progress : player.progress;
            const currentWpm = isLocal ? typingEngine.wpm : player.wpm;
            const isConnected = player.isConnected !== false;
            const currentRank = rankedPlayers.findIndex((p) => p.id === player.id) + 1;

            return (
              <div
                key={player.id}
                className={`p-3 rounded-lg border transition-colors ${
                  isLocal
                    ? 'border-[#FF5A00] bg-[#FF5A00]/5'
                    : 'border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01]'
                }`}
              >
                {/* Lane Info */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      currentRank === 1
                        ? 'border-[#FF5A00] text-[#FF5A00]'
                        : 'border-[#E5E5E5] dark:border-[#333333] text-[#646669]'
                    }`}>
                      #{currentRank}
                    </span>

                    <span className={`font-bold text-xs truncate ${isLocal ? 'text-[#FF5A00]' : 'text-[#111111] dark:text-[#F5F5F5]'}`}>
                      {player.name} {isLocal && '(You)'}
                    </span>

                    {player.isFinished && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded border border-[#FF5A00]/40 text-[#FF5A00] font-bold">
                        Finished
                      </span>
                    )}

                    {!isConnected && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 flex items-center gap-1 font-bold">
                        <WifiOff className="w-2.5 h-2.5" /> DNF
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono">
                    <span className="font-bold text-[#FF5A00]">{currentWpm}</span> WPM · {Math.round(currentProgress)}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#E5E5E5]/60 dark:bg-[#1A1A1A] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 rounded-full ${
                      isLocal ? 'bg-[#FF5A00]' : 'bg-[#646669]/60 dark:bg-[#646669]/40'
                    }`}
                    style={{ width: `${Math.max(2, currentProgress)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typing Area for the Identical Passage */}
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

    </div>
  );
};
