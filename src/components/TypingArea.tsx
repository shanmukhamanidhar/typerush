import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, ShieldAlert, MousePointer, Pause, Play, Quote } from 'lucide-react';
import { CursorStyle, TestMode } from '../types/typing';

interface TypingAreaProps {
  passage: string;
  typedChars: string;
  charStatuses: ('correct' | 'incorrect' | 'current' | 'pending')[];
  cursorStyle: CursorStyle;
  isStarted: boolean;
  isFinished: boolean;
  isPaused?: boolean;
  mode?: TestMode;
  quoteAuthor?: string;
  wordsProgressText?: string;
  pasteAttempted: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onRestart: () => void;
  onTogglePause?: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  passage,
  typedChars,
  charStatuses,
  cursorStyle,
  isStarted,
  isFinished,
  isPaused = false,
  mode,
  quoteAuthor,
  wordsProgressText,
  pasteAttempted,
  onKeyDown,
  onPaste,
  onRestart,
  onTogglePause,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Auto-focus input on mount or restart
  useEffect(() => {
    if (!isFinished && !isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFinished, isPaused, passage]);

  const handleContainerClick = () => {
    if (inputRef.current && !isFinished && !isPaused) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Cursor rendering based on style
  const renderCursor = () => {
    if (cursorStyle === 'block') {
      return (
        <span className="inline-block w-[0.55em] h-[1.15em] bg-cyan-400/80 animate-pulse align-middle -mt-0.5 rounded-[1px] shadow-sm shadow-cyan-400" />
      );
    }
    if (cursorStyle === 'underline') {
      return (
        <span className="inline-block w-[0.55em] h-[3px] bg-cyan-400 animate-pulse align-bottom mb-0.5 rounded-full shadow-sm shadow-cyan-400" />
      );
    }
    // Default 'line'
    return (
      <span className="inline-block w-[2.5px] h-[1.25em] bg-cyan-400 animate-cursor-blink align-middle -mt-0.5 shadow-sm shadow-cyan-400" />
    );
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-text select-none ${
        isFocused 
          ? 'bg-white dark:bg-[#0f172a]/95 border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10' 
          : 'bg-slate-50/80 dark:bg-[#0c1220]/80 border-2 border-dashed border-slate-300 dark:border-slate-800'
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
        disabled={isFinished || isPaused}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="absolute inset-0 opacity-0 cursor-default pointer-events-none w-full h-full -z-10"
        aria-label="Typing input area"
      />

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-30 font-mono">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3">
            <Pause className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">SESSION PAUSED</h3>
          <p className="text-xs text-slate-400 font-sans mb-4">
            Typing engine and timer are paused. Click resume or press Escape to continue.
          </p>
          <button
            onClick={onTogglePause}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME TYPING</span>
          </button>
        </div>
      )}

      {/* Focus Lost Notice */}
      {!isFocused && !isFinished && !isPaused && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] rounded-3xl flex items-center justify-center z-20">
          <div className="bg-slate-900/90 text-white px-5 py-2.5 rounded-xl border border-cyan-500/40 shadow-xl flex items-center gap-2 text-sm font-medium animate-pulse font-mono">
            <MousePointer className="w-4 h-4 text-cyan-400" />
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
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {isStarted ? 'Session in progress' : 'Ready · Start typing to initiate'}
          </span>
          {mode === 'words' && wordsProgressText && (
            <span className="text-xs font-bold text-cyan-400 ml-2">
              [{wordsProgressText}]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isStarted && !isFinished && onTogglePause && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePause();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
            title="Restart Test"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Passage Display with Character-by-Character Styling */}
      <div className="font-mono text-xl sm:text-2xl leading-relaxed tracking-wide min-h-[140px] text-justify break-words whitespace-pre-wrap">
        {passage.split('').map((char, index) => {
          const status = charStatuses[index] || 'pending';
          const isCurrent = status === 'current';
          const isCorrect = status === 'correct';
          const isIncorrect = status === 'incorrect';

          let charColorClass = 'text-slate-400/50 dark:text-slate-500/50'; // pending
          if (isCorrect) {
            charColorClass = 'text-slate-900 dark:text-cyan-300 font-semibold';
          } else if (isIncorrect) {
            charColorClass = 'text-rose-500 bg-rose-500/20 underline decoration-rose-500 decoration-2 rounded-[2px]';
          }

          return (
            <span key={index} className="relative inline">
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
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end text-xs text-cyan-400 font-mono italic">
          <Quote className="w-3.5 h-3.5 mr-1" />
          <span>— {quoteAuthor}</span>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
        <span>Characters: {typedChars.length} / {passage.length}</span>
        <span>Backspace supported · Strict live evaluation</span>
      </div>
    </div>
  );
};
