import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RotateCcw, Globe } from 'lucide-react';
import { Difficulty, Category, TestMode, QuoteLength, UserSettings } from '../types/typing';
import { TestConfigBar } from './config/TestConfigBar';

interface MainTypingViewProps {
  passage: string;
  typedChars: string;
  charStatuses: ('correct' | 'incorrect' | 'extra' | 'missed' | 'current' | 'pending')[];
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  totalErrors: number;
  correctCount: number;
  isStarted: boolean;
  isFinished: boolean;
  isPaused: boolean;
  mode: TestMode;
  duration: number;
  wordCount?: number;
  quoteLength?: QuoteLength;
  punctuation?: boolean;
  numbers?: boolean;
  languageName?: string;
  settings?: UserSettings;
  difficulty: Difficulty;
  category: Category;
  onSelectMode?: (mode: TestMode) => void;
  onSelectDuration: (duration: number) => void;
  onSelectWordCount?: (words: number) => void;
  onSelectQuoteLength?: (length: QuoteLength) => void;
  onTogglePunctuation?: () => void;
  onToggleNumbers?: () => void;
  onOpenLanguageModal?: () => void;
  onSelectDifficulty?: (difficulty: Difficulty) => void;
  onSelectCategory?: (category: Category) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onRestart: () => void;
  quoteAuthor?: string;
  metricsHistory?: { second: number; wpm: number; accuracy: number }[];
}

export const MainTypingView: React.FC<MainTypingViewProps> = ({
  passage,
  typedChars,
  charStatuses,
  wpm,
  accuracy,
  elapsedSeconds,
  isStarted,
  isFinished,
  isPaused,
  mode,
  duration,
  wordCount = 25,
  quoteLength = 'medium',
  punctuation = false,
  numbers = false,
  languageName = 'english',
  settings,
  category,
  onSelectMode,
  onSelectDuration,
  onSelectWordCount,
  onSelectQuoteLength,
  onTogglePunctuation,
  onToggleNumbers,
  onOpenLanguageModal,
  onKeyDown,
  onPaste,
  onRestart,
  quoteAuthor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Maintain input focus
  useEffect(() => {
    if (!isFinished && !isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFinished, isPaused, passage]);

  const handleFocusInput = () => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Segment passage into word tokens with guaranteed space preservation and wrapping
  const parsedWords = useMemo(() => {
    const words: {
      id: number;
      chars: { char: string; index: number }[];
      trailingSpace?: { char: string; index: number };
    }[] = [];

    let currentChars: { char: string; index: number }[] = [];
    let wordId = 0;

    for (let i = 0; i < passage.length; i++) {
      const char = passage[i];
      if (char === ' ') {
        words.push({
          id: wordId++,
          chars: currentChars,
          trailingSpace: { char: ' ', index: i },
        });
        currentChars = [];
      } else if (char === '\n') {
        words.push({
          id: wordId++,
          chars: currentChars,
          trailingSpace: { char: '\n', index: i },
        });
        currentChars = [];
      } else {
        currentChars.push({ char, index: i });
      }
    }

    if (currentChars.length > 0) {
      words.push({
        id: wordId++,
        chars: currentChars,
      });
    }

    return words;
  }, [passage]);

  // Precise Progress & Completion calculations
  const timeLeft = Math.max(0, duration - elapsedSeconds);
  const timeDone = Math.min(duration, elapsedSeconds);
  
  const wordsDone = useMemo(() => {
    return typedChars.trim().length > 0 ? typedChars.trim().split(/\s+/).length : 0;
  }, [typedChars]);
  const targetWords = wordCount || 25;
  const wordsLeft = Math.max(0, targetWords - wordsDone);

  const charsDone = typedChars.length;
  const charsTotal = Math.max(1, passage.length);
  const charsLeft = Math.max(0, passage.length - charsDone);

  const progressPercent = useMemo(() => {
    if (mode === 'time') {
      return Math.min(100, Math.max(0, (elapsedSeconds / Math.max(1, duration)) * 100));
    }
    if (mode === 'words') {
      return Math.min(100, Math.max(0, (wordsDone / Math.max(1, targetWords)) * 100));
    }
    return Math.min(100, Math.max(0, (charsDone / charsTotal) * 100));
  }, [mode, elapsedSeconds, duration, wordsDone, targetWords, charsDone, charsTotal]);

  // Typography Settings
  const fontFamilyStyle = useMemo(() => {
    if (settings?.fontFamily === 'mono') return 'monospace';
    if (settings?.fontFamily === 'sans') return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    return '"Times New Roman", Times, Georgia, serif';
  }, [settings?.fontFamily]);

  const fontSizeClass = useMemo(() => {
    if (settings?.fontSize === 'sm') return 'text-xl sm:text-2xl leading-[1.7]';
    if (settings?.fontSize === 'lg') return 'text-3xl sm:text-4xl leading-[2.1]';
    if (settings?.fontSize === 'xl') return 'text-4xl sm:text-5xl leading-[2.3]';
    return 'text-2xl sm:text-3xl lg:text-3xl leading-[1.8] sm:leading-[2.0]';
  }, [settings?.fontSize]);

  // Caret Settings
  const caretColor = settings?.caretColor === 'neutral' ? '#F5F5F5' : '#FF5A00';
  const caretOpacity = (settings?.caretOpacity || 100) / 100;
  const caretAnim = settings?.caretAnimation === 'static' ? '' : 'animate-pulse';

  const renderCaret = (isSpace = false) => {
    if (!isFocused) return null;
    const style: React.CSSProperties = {
      backgroundColor: caretColor,
      opacity: caretOpacity,
    };

    if (settings?.cursorStyle === 'block') {
      return (
        <span 
          style={{ ...style, backgroundColor: caretColor, opacity: 0.35 }}
          className={`absolute inset-0 pointer-events-none rounded-[1px] z-10 ${caretAnim}`}
        />
      );
    }

    if (settings?.cursorStyle === 'underline') {
      return (
        <span 
          style={style}
          className={`absolute left-0 right-0 bottom-0 h-[2.5px] pointer-events-none rounded-[1px] z-10 ${caretAnim}`}
        />
      );
    }

    // Default: line caret
    return (
      <span 
        style={style}
        className={`absolute -left-[1.5px] top-[10%] bottom-[10%] w-[2.5px] pointer-events-none rounded-[1px] z-10 ${caretAnim}`}
      />
    );
  };

  return (
    <div 
      onClick={handleFocusInput}
      className="w-full max-w-5xl mx-auto flex flex-col justify-between items-center py-6 sm:py-10 select-none font-mono cursor-text min-h-[70vh] animate-fadeIn"
    >
      {/* Hidden real input capturing user keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onChange={() => {}}
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
        className="absolute inset-0 opacity-0 cursor-default pointer-events-none -z-20 w-0 h-0"
        aria-label="Typing input"
      />

      {/* TOP: Lightweight Horizontal Monkeytype-style Config Toolbar */}
      {!settings?.hideElements?.testConfig && (
        <TestConfigBar
          mode={mode}
          duration={duration}
          wordCount={wordCount}
          quoteLength={quoteLength}
          punctuation={punctuation}
          numbers={numbers}
          languageName={languageName}
          onSelectMode={(m) => onSelectMode && onSelectMode(m)}
          onSelectDuration={onSelectDuration}
          onSelectWordCount={(w) => onSelectWordCount && onSelectWordCount(w)}
          onSelectQuoteLength={(q) => onSelectQuoteLength && onSelectQuoteLength(q)}
          onTogglePunctuation={() => onTogglePunctuation && onTogglePunctuation()}
          onToggleNumbers={() => onToggleNumbers && onToggleNumbers()}
          onOpenLanguageModal={() => onOpenLanguageModal && onOpenLanguageModal()}
          isStarted={isStarted}
        />
      )}

      {/* CENTER WORKSPACE: Minimal language indicator, Live Counter & Large Open Typing Text */}
      <div className="w-full flex flex-col justify-center my-auto py-8">
        
        {/* Subtle Indicator & Live Metric Row above text */}
        <div className="flex items-center justify-between mb-2 px-2 text-xs text-[#646669] dark:text-[#646669] h-7">
          
          {/* Language / Mode indicator */}
          <div 
            onClick={() => onOpenLanguageModal && onOpenLanguageModal()}
            className="flex items-center gap-1.5 opacity-70 cursor-pointer hover:opacity-100 hover:text-[#FF5A00] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="capitalize">{languageName}</span>
          </div>

          {/* Live Performance & Progress indicators (WPM, Accuracy, Left & Completed) */}
          <div className="flex items-center gap-4 text-xs font-mono">
            {isStarted ? (
              <>
                {!settings?.hideElements?.wpm && (
                  <span>
                    <span className="text-[#FF5A00] font-bold">{wpm}</span> wpm
                  </span>
                )}

                {!settings?.hideElements?.accuracy && (
                  <span>
                    <span className="text-[#111111] dark:text-[#F5F5F5] font-bold">{accuracy.toFixed(1)}%</span> acc
                  </span>
                )}
                
                {/* Mode-specific completion and remaining indicator */}
                {!settings?.hideElements?.timer && (
                  mode === 'time' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#FF5A00] font-bold text-sm">
                        {timeLeft}s left
                      </span>
                      <span className="text-[11px] text-[#646669] dark:text-[#646669] opacity-80">
                        ({timeDone}s done · {Math.round(progressPercent)}%)
                      </span>
                    </div>
                  ) : mode === 'words' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#FF5A00] font-bold text-sm">
                        {wordsLeft} words left
                      </span>
                      <span className="text-[11px] text-[#646669] dark:text-[#646669] opacity-80">
                        ({wordsDone}/{targetWords} done)
                      </span>
                    </div>
                  ) : mode === 'zen' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#FF5A00] font-bold text-sm">
                        {wordsDone} words
                      </span>
                      <span className="text-[11px] text-[#646669] dark:text-[#646669] opacity-80">
                        ({elapsedSeconds}s)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#FF5A00] font-bold text-sm">
                        {charsLeft} chars left
                      </span>
                      <span className="text-[11px] text-[#646669] dark:text-[#646669] opacity-80">
                        ({Math.round(progressPercent)}% done)
                      </span>
                    </div>
                  )
                )}
              </>
            ) : (
              mode === 'time' ? (
                <span className="text-[#FF5A00] font-bold text-sm opacity-80">
                  {duration}s duration
                </span>
              ) : mode === 'words' ? (
                <span className="text-[#FF5A00] font-bold text-sm opacity-80">
                  {targetWords} words
                </span>
              ) : (
                <span className="text-[#FF5A00] font-bold text-sm opacity-80">
                  ready
                </span>
              )
            )}
          </div>
        </div>

        {/* Sleek Minimal Progress Bar */}
        {!settings?.hideElements?.progressBar && (
          <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-[#FF5A00] transition-all duration-150 ease-out rounded-full"
              style={{ width: `${isStarted ? progressPercent : 0}%` }}
            />
          </div>
        )}

        {/* The Typing Text Area (pure open viewport) */}
        <div className="relative text-left">
          
          {/* Out-of-focus message */}
          {!isFocused && !isFinished && (
            <div className="absolute inset-0 bg-[#F7F6F2]/80 dark:bg-[#000000]/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <span className="text-xs text-[#FF5A00] tracking-widest uppercase font-semibold">
                Click or press any key to focus
              </span>
            </div>
          )}

          {/* Large Typographic Text with configurable font and size */}
          <div 
            style={{ fontFamily: fontFamilyStyle }}
            className={`${fontSizeClass} tracking-normal select-none flex flex-wrap content-start`}
          >
            {parsedWords.map((word) => (
              <span key={word.id} className="inline-flex items-center">
                {/* Letters of current word */}
                {word.chars.map(({ char, index }) => {
                  const status = charStatuses[index] || 'pending';
                  const isCurrent = index === typedChars.length;

                  let charColor = 'text-[#999999] dark:text-[#646669]'; // upcoming/pending
                  let charBg = '';

                  if (settings?.blindMode) {
                    // Blind mode hides success/error colors during typing
                    charColor = status === 'pending' ? 'text-[#999999] dark:text-[#646669]' : 'text-[#111111] dark:text-[#F5F5F5]';
                  } else {
                    if (status === 'correct') {
                      charColor = 'text-[#111111] dark:text-[#F5F5F5]';
                    } else if (status === 'incorrect') {
                      charColor = 'text-[#FF3B5C] underline decoration-[#FF3B5C] underline-offset-4';
                      charBg = 'bg-[#FF3B5C]/15 rounded-[2px]';
                    }
                  }

                  return (
                    <span key={index} className="relative inline-block">
                      {isCurrent && renderCaret(false)}
                      <span className={`${charColor} ${charBg}`}>
                        {char}
                      </span>
                    </span>
                  );
                })}

                {/* Trailing Space or Newline between words */}
                {word.trailingSpace && (() => {
                  const spaceIdx = word.trailingSpace.index;
                  const status = charStatuses[spaceIdx] || 'pending';
                  const isCurrent = spaceIdx === typedChars.length;

                  if (word.trailingSpace.char === '\n') {
                    return (
                      <span key={spaceIdx} className="basis-full h-0">
                        {isCurrent && isFocused && (
                          <span className="inline-block w-[2.5px] h-6 bg-[#FF5A00] animate-pulse rounded-[1px]" />
                        )}
                      </span>
                    );
                  }

                  let spaceColor = 'text-[#999999] dark:text-[#646669]';
                  let spaceBg = '';
                  let spaceContent = '\u00A0';

                  if (settings?.blindMode) {
                    spaceColor = status === 'pending' ? 'text-[#999999] dark:text-[#646669]' : 'text-[#111111] dark:text-[#F5F5F5]';
                  } else {
                    if (status === 'correct') {
                      spaceColor = 'text-[#111111] dark:text-[#F5F5F5]';
                    } else if (status === 'incorrect') {
                      spaceColor = 'text-[#FF3B5C]';
                      spaceBg = 'bg-[#FF3B5C]/25 rounded-[2px]';
                      spaceContent = '_';
                    }
                  }

                  return (
                    <span key={spaceIdx} className="relative inline-block w-[0.45em] text-center">
                      {isCurrent && renderCaret(true)}
                      <span className={`${spaceColor} ${spaceBg} inline-block w-full`}>
                        {spaceContent}
                      </span>
                    </span>
                  );
                })()}
              </span>
            ))}

            {/* Final Caret if at very end of passage */}
            {typedChars.length >= passage.length && isFocused && (
              <span 
                style={{ backgroundColor: caretColor, opacity: caretOpacity }}
                className={`inline-block w-[2.5px] h-[1.3em] rounded-[1px] self-center ml-0.5 ${caretAnim}`} 
              />
            )}
          </div>

          {/* Quote Author attribution if present */}
          {quoteAuthor && (
            <div className="mt-4 text-right text-xs text-[#646669] dark:text-[#646669] italic">
              — {quoteAuthor}
            </div>
          )}

        </div>

      </div>

      {/* BOTTOM: Minimal Restart Icon & Keyboard Instructions */}
      {!settings?.hideElements?.footer && (
        <div className="flex flex-col items-center justify-center gap-3 pt-4">
          {/* Restart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
              handleFocusInput();
            }}
            className="p-2 text-[#646669] dark:text-[#646669] hover:text-[#FF5A00] dark:hover:text-[#FF5A00] transition-colors cursor-pointer rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            title="Restart Test (Tab + Enter)"
            aria-label="Restart Test"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Minimal Muted Shortcuts */}
          <div className="text-[11px] text-[#646669]/70 dark:text-[#646669]/70 flex items-center gap-2">
            <span><kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[#D8D6D1] dark:border-[#242424] text-[10px]">tab</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[#D8D6D1] dark:border-[#242424] text-[10px]">enter</kbd> — restart</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[#D8D6D1] dark:border-[#242424] text-[10px]">esc</kbd> — pause</span>
          </div>

          {/* Pause indicator */}
          {isPaused && (
            <div className="text-xs text-[#FF5A00] tracking-widest uppercase font-semibold mt-1">
              Test paused — press Esc to resume
            </div>
          )}
        </div>
      )}

    </div>
  );
};
