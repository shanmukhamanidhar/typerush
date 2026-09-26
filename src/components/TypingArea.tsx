import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, ShieldAlert, MousePointer, Pause, Play, Quote, AlertOctagon, Sparkles, Flag, ArrowRight } from 'lucide-react';
import { CursorStyle, TestMode } from '../types/typing';

interface TypingAreaProps {
  passage: string;
  typedChars: string;
  charStatuses: ('correct' | 'incorrect' | 'extra' | 'missed' | 'current' | 'pending')[];
  cursorStyle: CursorStyle;
  paceCharIndex?: number;
  isStarted: boolean;
  isFinished: boolean;
  isPaused?: boolean;
  isFailed?: boolean;
  failedReason?: string | null;
  mode?: TestMode;
  blindMode?: boolean;
  confidenceMode?: boolean;
  capsLockActive?: boolean;
  quoteAuthor?: string;
  wordsProgressText?: string;
  pasteAttempted: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onRestart: () => void;
  onCompleteZen?: () => void;
  onTogglePause?: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  passage,
  typedChars,
  charStatuses,
  cursorStyle,
  paceCharIndex = -1,
  isStarted,
  isFinished,
  isPaused = false,
  isFailed = false,
  failedReason,
  mode,
  blindMode = false,
  confidenceMode = false,
  capsLockActive = false,
  quoteAuthor,
  wordsProgressText,
  pasteAttempted,
  onKeyDown,
  onPaste,
  onRestart,
  onCompleteZen,
  onTogglePause,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Auto-focus input on mount or restart
  useEffect(() => {
    if (!isFinished && !isPaused && !isFailed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFinished, isPaused, isFailed, passage]);

  const handleContainerClick = () => {
    if (inputRef.current && !isFinished && !isPaused && !isFailed) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // User Cursor rendering based on style
  const renderCursor = () => {
    if (cursorStyle === 'off') return null;

    if (cursorStyle === 'block') {
      return (
        <span className="inline-block w-[0.55em] h-[1.15em] bg-[#FF5A00]/85 animate-pulse align-middle -mt-0.5 rounded-[1px] shadow-[0_0_8px_#FF5A00]" />
      );
    }
    if (cursorStyle === 'underline') {
      return (
        <span className="inline-block w-[0.55em] h-[2.5px] bg-[#FF5A00] animate-pulse align-bottom mb-0.5 rounded-xs shadow-[0_0_8px_#FF5A00]" />
      );
    }
    // Default 'line'
    return (
      <span className="inline-block w-[2.5px] h-[1.25em] bg-[#FF5A00] animate-cursor-blink align-middle -mt-0.5 shadow-[0_0_8px_#FF5A00] rounded-[0.5px]" />
    );
  };

  // Pace Ghost Cursor rendering
  const renderPaceCursor = () => {
    return (
      <span 
        className="absolute -top-3 left-0 -ml-1 text-[9px] font-mono px-1 py-0.2 rounded bg-[#FF6E1A]/20 text-[#FF6E1A] border border-[#FF6E1A]/40 pointer-events-none select-none z-10 animate-pulse whitespace-nowrap shadow-xs"
        title="Reference Pace Caret"
      >
        PACE
      </span>
    );
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full max-w-4xl mx-auto rounded-2xl p-6 sm:p-8 transition-all duration-200 cursor-text select-none ${
        isFailed
          ? 'bg-[#FF3B5C]/5 border-2 border-[#FF3B5C] shadow-[0_0_20px_rgba(255,59,92,0.2)]'
          : isFocused 
            ? 'bg-white dark:bg-[#111111] border border-[#FF5A00] shadow-[0_0_20px_rgba(255,90,0,0.15)]' 
            : 'bg-[#F7F7F7] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#2A2A2A]'
      }`}
    >
      {/* Hidden real input handling keyboard events */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}} // Controlled by onKeyDown
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isFinished || isPaused || isFailed}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="absolute inset-0 opacity-0 cursor-default pointer-events-none w-full h-full -z-10"
        aria-label="Typing input area"
      />

      {/* TEST FAILED OVERLAY (Master / Expert / Min Thresholds) */}
      {isFailed && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center z-30 font-mono p-6 text-center animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mb-3 animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-rose-400 tracking-wider mb-1">
            TEST FAILED
          </h3>
          <p className="text-xs text-slate-300 max-w-md mb-6 leading-relaxed">
            {failedReason || 'Strict competition rules triggered an immediate test disqualification.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onRestart}
              className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-400 flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RESTART (ENTER)</span>
            </button>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-30 font-mono">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 flex items-center justify-center mb-3">
            <Pause className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">SESSION PAUSED</h3>
          <p className="text-xs text-[#A1A1AA] font-sans mb-4">
            Typing engine and timer are paused. Click resume or press Escape to continue.
          </p>
          <button
            onClick={onTogglePause}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FF5A00] text-black hover:bg-[#FF6E1A] flex items-center gap-1.5 shadow-[0_0_16px_rgba(255,90,0,0.3)] transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME TYPING</span>
          </button>
        </div>
      )}

      {/* Caps Lock Warning Banner */}
      {capsLockActive && !isFinished && !isPaused && !isFailed && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FF6E1A] text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-lg shadow-[#FF6E1A]/30 font-mono z-20 animate-pulse">
          <span>⇪ CAPS LOCK IS ON</span>
        </div>
      )}

      {/* Focus Lost Notice */}
      {!isFocused && !isFinished && !isPaused && !isFailed && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-20">
          <div className="bg-[#111111]/95 text-white px-5 py-2.5 rounded-xl border border-[#FF5A00]/40 shadow-xl flex items-center gap-2 text-sm font-medium animate-pulse font-mono">
            <MousePointer className="w-4 h-4 text-[#FF5A00]" />
            <span>Click anywhere to refocus typing engine</span>
          </div>
        </div>
      )}

      {/* Anti-cheat Paste Toast */}
      {pasteAttempted && (
        <div className="absolute top-3 right-14 bg-rose-500/15 border border-rose-500/40 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg animate-bounce z-30 font-mono">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Direct pasting is blocked. Please type the passage!</span>
        </div>
      )}

      {/* Top Controls in Typing Box */}
      <div className="flex items-center justify-between mb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-ping" />
          <span className="text-xs font-semibold text-[#6B6B6B] dark:text-[#A1A1AA] uppercase tracking-wider">
            {isStarted ? 'Live Engine Active' : 'Ready · Type to initiate'}
          </span>

          {mode === 'words' && wordsProgressText && (
            <span className="text-xs font-bold text-[#FF5A00] ml-1">
              [{wordsProgressText}]
            </span>
          )}

          {mode === 'zen' && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FF5A00]/15 text-[#FF5A00] border border-[#FF5A00]/35 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>ZEN</span>
            </span>
          )}

          {confidenceMode && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF6E1A]/15 text-[#FF6E1A] border border-[#FF6E1A]/30">
              NO BACKSPACE
            </span>
          )}

          {blindMode && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF6E1A]/15 text-[#FF6E1A] border border-[#FF6E1A]/30">
              BLIND MODE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mode === 'zen' && isStarted && onCompleteZen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompleteZen();
              }}
              className="px-3 py-1 rounded-lg bg-[#FF5A00]/15 text-[#FF5A00] hover:bg-[#FF5A00] hover:text-black font-bold text-xs flex items-center gap-1 border border-[#FF5A00]/40 transition-all shadow-xs"
              title="Finish Zen Session and Record Results"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>FINISH ZEN</span>
            </button>
          )}

          {isStarted && !isFinished && !isFailed && onTogglePause && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePause();
              }}
              className="p-1.5 rounded-lg text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF5A00]/40 transition-all text-xs flex items-center gap-1"
              title="Pause Session (or press Escape)"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            className="p-1.5 rounded-lg text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF5A00]/40 transition-all text-xs flex items-center gap-1"
            title="Restart Test"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Passage Display with Character-by-Character Styling */}
      <div className="font-mono text-xl sm:text-2xl leading-relaxed tracking-wide min-h-[140px] text-justify break-words whitespace-pre-wrap relative">
        {passage.split('').map((char, index) => {
          const status = charStatuses[index] || 'pending';
          const isCurrent = status === 'current';
          const isCorrect = status === 'correct';
          const isIncorrect = status === 'incorrect';
          const isPaceTarget = paceCharIndex === index;

          let charColorClass = 'text-[#777777] dark:text-[#555555]'; // pending

          if (blindMode) {
            // In Blind Mode, hide coloring while typing
            if (isCorrect || isIncorrect) {
              charColorClass = 'text-[#333333] dark:text-[#CCCCCC]';
            }
          } else {
            if (isCorrect) {
              charColorClass = 'text-[#111111] dark:text-white font-semibold';
            } else if (isIncorrect) {
              charColorClass = 'text-[#FF3B5C] bg-[#FF3B5C]/15 underline decoration-[#FF3B5C] decoration-2 rounded-[2px]';
            }
          }

          return (
            <span key={index} className="relative inline">
              {isPaceTarget && renderPaceCursor()}
              {isCurrent && renderCursor()}
              <span className={`${charColorClass} transition-colors duration-75`}>
                {char === '\n' ? '↵\n' : char}
              </span>
            </span>
          );
        })}
      </div>

      {/* Quote Author Attribution if Quote Mode */}
      {quoteAuthor && (
        <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-end text-xs text-[#FF5A00] font-mono italic">
          <Quote className="w-3.5 h-3.5 mr-1" />
          <span>— {quoteAuthor}</span>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-wrap items-center justify-between text-[11px] text-[#6B6B6B] dark:text-[#A1A1AA] font-mono gap-2">
        <span>Characters: {typedChars.length} / {passage.length}</span>
        <span>
          {mode === 'zen' ? 'Continuous buffer · Shift+Enter to finish' : 'Strict keystroke evaluation · Tab+Enter or Esc to reset'}
        </span>
      </div>
    </div>
  );
};
