import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  ChevronRight, 
  Copy, 
  Check, 
  Share2, 
  Coffee 
} from 'lucide-react';
import { TestResult, PersonalBests } from '../types/typing';
import { PerformanceGraph } from './PerformanceGraph';

interface ResultsPanelProps {
  result: TestResult;
  personalBests: PersonalBests;
  history: TestResult[];
  onTryAgain: () => void;
  onChangeMode: () => void;
  onViewHistory: () => void;
  onPracticeMissedWords?: () => void;
  onUpdateTags?: (testId: string, tags: string[]) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  personalBests,
  onTryAgain,
  onChangeMode,
  onViewHistory,
  onPracticeMissedWords,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const isNewPb = result.wpm > (personalBests.bestWpm || 0);

  useEffect(() => {
    if (isNewPb || result.wpm >= 75) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5A00', '#FF6E1A', '#FFB15C', '#D95F00'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isNewPb, result.wpm]);

  const handleCopySummary = () => {
    const summary = `typerush result: ${result.wpm} wpm (${result.rawWpm} raw) | ${result.accuracy.toFixed(1)}% acc | ${result.mode} ${result.duration || 30}s`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 select-none font-mono animate-fadeIn">
      
      {/* Main Results Layout: Stats on Left, Graph on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Stats Column (WPM, Accuracy & Sub-metrics) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Net WPM */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[#646669] dark:text-[#646669] block mb-1">
              wpm
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-black text-[#FF5A00] tracking-tight leading-none">
                {result.wpm}
              </span>
              {isNewPb && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF5A00]/15 text-[#FF5A00] border border-[#FF5A00]/30 uppercase">
                  pb
                </span>
              )}
            </div>
          </div>

          {/* Accuracy */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[#646669] dark:text-[#646669] block mb-1">
              acc
            </span>
            <span className="text-6xl sm:text-7xl font-black text-[#111111] dark:text-[#F5F5F5] tracking-tight leading-none">
              {result.accuracy.toFixed(1)}%
            </span>
          </div>

          {/* Minor Sub-stats Details */}
          <div className="pt-4 space-y-2 text-xs text-[#646669] dark:text-[#646669] border-t border-[#D8D6D1] dark:border-[#242424]">
            <div className="flex justify-between">
              <span>test type</span>
              <span className="text-[#111111] dark:text-[#F5F5F5]">
                {result.mode} {result.duration ? `${result.duration}s` : ''} {result.category || 'english'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>raw</span>
              <span className="text-[#111111] dark:text-[#F5F5F5]">
                {result.rawWpm} wpm
              </span>
            </div>
            <div className="flex justify-between">
              <span>peak</span>
              <span className="text-[#FF5A00] font-bold">
                {result.burstSpeed?.peakWpm || result.wpm} wpm
              </span>
            </div>
            <div className="flex justify-between">
              <span>characters</span>
              <span className="text-[#111111] dark:text-[#F5F5F5]">
                <span className="text-[#FF5A00]">{result.characterBreakdown?.correct ?? result.correctChars}</span>
                /
                <span className="text-[#FF3B5C]">{result.characterBreakdown?.incorrect ?? result.incorrectChars}</span>
                /
                <span>{result.characterBreakdown?.extra ?? 0}</span>
                /
                <span>{result.characterBreakdown?.missed ?? 0}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span>consistency</span>
              <span className="text-[#111111] dark:text-[#F5F5F5]">
                {result.consistency || 88}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>time</span>
              <span className="text-[#111111] dark:text-[#F5F5F5]">
                {result.duration || 30}s
              </span>
            </div>
          </div>

        </div>

        {/* Right Graph Column (Minimal Performance Graph) */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="w-full">
            <PerformanceGraph
              metrics={result.metricsHistory}
              duration={result.duration || 30}
              height={220}
              showLabels={true}
            />
          </div>
        </div>

      </div>

      {/* Bottom Minimal Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-[#D8D6D1] dark:border-[#242424]">
        
        {/* Restart Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTryAgain}
            className="p-2 text-[#646669] dark:text-[#646669] hover:text-[#FF5A00] dark:hover:text-[#FF5A00] transition-colors cursor-pointer rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            title="Next Test (Enter)"
            aria-label="Restart Test"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <span className="text-xs text-[#646669] dark:text-[#646669]">
            press <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[#D8D6D1] dark:border-[#242424] text-[10px]">enter</kbd> for next test
          </span>
        </div>

        {/* Secondary utilities */}
        <div className="flex items-center gap-3 text-xs text-[#646669] dark:text-[#646669]">
          
          {result.errors > 0 && onPracticeMissedWords && (
            <button
              onClick={onPracticeMissedWords}
              className="flex items-center gap-1.5 hover:text-[#FF5A00] transition-colors cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>practice errors</span>
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#FF5A00]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'copied' : 'copy'}</span>
          </button>

          <button
            onClick={onChangeMode}
            className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            change mode
          </button>

          <button
            onClick={onViewHistory}
            className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          >
            view stats
          </button>

        </div>

      </div>

    </div>
  );
};
