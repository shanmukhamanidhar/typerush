import React from 'react';
import { Globe, Clock, Type, Quote, Sparkles, Wrench } from 'lucide-react';
import { TestMode, QuoteLength } from '../../types/typing';

interface TestConfigBarProps {
  mode: TestMode;
  duration: number;
  wordCount: number;
  quoteLength: QuoteLength;
  punctuation: boolean;
  numbers: boolean;
  languageName: string;
  onSelectMode: (mode: TestMode) => void;
  onSelectDuration: (duration: number) => void;
  onSelectWordCount: (words: number) => void;
  onSelectQuoteLength: (length: QuoteLength) => void;
  onTogglePunctuation: () => void;
  onToggleNumbers: () => void;
  onOpenLanguageModal: () => void;
  isStarted: boolean;
}

export const TestConfigBar: React.FC<TestConfigBarProps> = ({
  mode,
  duration,
  wordCount,
  quoteLength,
  punctuation,
  numbers,
  languageName,
  onSelectMode,
  onSelectDuration,
  onSelectWordCount,
  onSelectQuoteLength,
  onTogglePunctuation,
  onToggleNumbers,
  onOpenLanguageModal,
  isStarted,
}) => {
  const durations = [15, 30, 60, 120];
  const wordCounts = [10, 25, 50, 100];
  const quoteLengths: { id: QuoteLength; label: string }[] = [
    { id: 'random', label: 'all' },
    { id: 'short', label: 'short' },
    { id: 'medium', label: 'medium' },
    { id: 'long', label: 'long' },
  ];

  return (
    <div className={`w-full max-w-full overflow-x-auto no-scrollbar py-1 transition-opacity duration-200 select-none ${isStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex items-center justify-start sm:justify-center min-w-max sm:min-w-0 sm:flex-wrap gap-x-2 sm:gap-x-3 gap-y-1.5 px-3 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.03] text-xs font-mono text-[#646669] dark:text-[#646669] border border-black/[0.04] dark:border-white/[0.04]">
        
        {/* Left Section: Modifiers (Punctuation & Numbers) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePunctuation();
            }}
            className={`flex items-center gap-1 transition-colors cursor-pointer px-2 py-1 rounded active:bg-black/5 dark:active:bg-white/5 ${
              punctuation
                ? 'text-[#FF5A00] font-bold'
                : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
            title="Toggle Punctuation"
          >
            <span>@</span>
            <span>punctuation</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleNumbers();
            }}
            className={`flex items-center gap-1 transition-colors cursor-pointer px-2 py-1 rounded active:bg-black/5 dark:active:bg-white/5 ${
              numbers
                ? 'text-[#FF5A00] font-bold'
                : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
            title="Toggle Numbers"
          >
            <span>#</span>
            <span>numbers</span>
          </button>
        </div>

        <span className="text-[#646669]/30">|</span>

        {/* Center Section: Primary Modes */}
        <div className="flex items-center gap-2">
          {/* Time Mode */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('time');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer px-1.5 py-0.5 rounded ${
              mode === 'time'
                ? 'text-[#FF5A00] font-bold'
                : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
            title="Time Mode"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>time</span>
          </button>

          {/* Words Mode */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('words');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer px-1.5 py-0.5 rounded ${
              mode === 'words'
                ? 'text-[#FF5A00] font-bold'
                : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
            title="Words Mode"
          >
            <Type className="w-3.5 h-3.5" />
            <span>words</span>
          </button>

          {/* Quote Mode */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('quote');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer px-1.5 py-0.5 rounded ${
              mode === 'quote'
                ? 'text-[#FF5A00] font-bold'
                : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
            title="Quote Mode"
          >
            <Quote className="w-3.5 h-3.5" />
            <span>quote</span>
          </button>

          {/* Zen Mode */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('zen');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer px-1.5 py-0.5 rounded ${
              mode === 'zen'
                ? 'text-[#FF5A00] font-bold'
                : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
            title="Zen Freeform Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>zen</span>
          </button>

          {/* Custom Mode */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('custom');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer px-1.5 py-0.5 rounded ${
              mode === 'custom'
                ? 'text-[#FF5A00] font-bold'
                : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
            title="Custom Text Mode"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>custom</span>
          </button>
        </div>

        {/* Right Section: Mode Sub-options */}
        {mode === 'time' && (
          <>
            <span className="text-[#646669]/30">|</span>
            <div className="flex items-center gap-2">
              {durations.map(d => (
                <button
                  key={d}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDuration(d);
                  }}
                  className={`transition-colors cursor-pointer px-1 py-0.5 ${
                    duration === d
                      ? 'text-[#FF5A00] font-bold'
                      : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'words' && (
          <>
            <span className="text-[#646669]/30">|</span>
            <div className="flex items-center gap-2">
              {wordCounts.map(w => (
                <button
                  key={w}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWordCount(w);
                  }}
                  className={`transition-colors cursor-pointer px-1 py-0.5 ${
                    wordCount === w
                      ? 'text-[#FF5A00] font-bold'
                      : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'quote' && (
          <>
            <span className="text-[#646669]/30">|</span>
            <div className="flex items-center gap-2">
              {quoteLengths.map(q => (
                <button
                  key={q.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectQuoteLength(q.id);
                  }}
                  className={`transition-colors cursor-pointer px-1 py-0.5 ${
                    quoteLength === q.id
                      ? 'text-[#FF5A00] font-bold'
                      : 'hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </>
        )}

        <span className="text-[#646669]/30">|</span>

        {/* Language Selector Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenLanguageModal();
          }}
          className="flex items-center gap-1.5 transition-colors cursor-pointer hover:text-[#FF5A00] text-[#646669] dark:text-[#646669] px-1.5 py-0.5 rounded group"
          title="Select Language / Dictionary"
        >
          <Globe className="w-3.5 h-3.5 group-hover:text-[#FF5A00] transition-colors" />
          <span className="capitalize">{languageName}</span>
        </button>

      </div>
    </div>
  );
};
