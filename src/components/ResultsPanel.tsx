import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Sliders, 
  History, 
  Trophy, 
  Award, 
  Target, 
  AlertCircle, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Share2, 
  Check, 
  Activity, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle
} from 'lucide-react';
import { TestResult, PersonalBests } from '../types/typing';
import { PerformanceGraph } from './PerformanceGraph';
import { getPerformanceRating } from '../utils/typingMetrics';

interface ResultsPanelProps {
  result: TestResult;
  personalBests: PersonalBests;
  history: TestResult[];
  onTryAgain: () => void;
  onChangeMode: () => void;
  onViewHistory: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  personalBests,
  history,
  onTryAgain,
  onChangeMode,
  onViewHistory,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const isNewPb = result.wpm > (personalBests.bestWpm || 0);
  const rating = getPerformanceRating(result.wpm, result.accuracy);

  // Compare against previous test and lifetime average
  const previousTest = history.length > 1 ? history[1] : null;
  const wpmDiffPrev = previousTest ? result.wpm - previousTest.wpm : null;
  
  const avgWpm = history.length > 0 
    ? Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length) 
    : result.wpm;
  const wpmDiffAvg = result.wpm - avgWpm;

  useEffect(() => {
    if (isNewPb || result.wpm >= 75) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#38bdf8', '#818cf8', '#34d399'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isNewPb, result.wpm]);

  // Clean formatted summary copy
  const handleCopySummary = () => {
    const modeDesc = result.mode === 'words' ? `${result.wordCount} Words` : result.duration ? `${result.duration}s` : result.mode;
    const summary = `⚡ TYPERUSH RESULT ⚡
Speed: ${result.wpm} WPM (Raw: ${result.rawWpm})
Accuracy: ${result.accuracy.toFixed(1)}%
Rating: ${result.sessionRating} (${rating.tier})
Errors: ${result.errors} | Consistency: ${result.consistency}%
Mode: ${modeDesc} · ${result.difficulty.toUpperCase()}
https://typerush.app`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TYPERUSH Performance',
          text: `I just typed ${result.wpm} WPM with ${result.accuracy.toFixed(1)}% accuracy on TYPERUSH!`,
          url: window.location.href,
        });
      } catch {
        handleCopySummary();
      }
    } else {
      handleCopySummary();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 animate-fadeIn font-mono">
      
      {/* Top Banner / PB Notification */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Session Complete
              </h2>
              {isNewPb && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 animate-pulse">
                  NEW PERSONAL BEST!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {result.mode.toUpperCase()} MODE · {result.difficulty.toUpperCase()} · {result.category.toUpperCase()}
              {result.quoteAuthor && ` · ${result.quoteAuthor}`}
              {result.language && ` · ${result.language.toUpperCase()}`}
            </p>
          </div>
        </div>

        {/* Rating Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-xs font-bold">
            GRADE {result.sessionRating}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${rating.badgeColor}`}>
            <Award className="w-4 h-4" />
            <span>{rating.tier}</span>
          </div>
        </div>
      </div>

      {/* Smart Insight Banner */}
      {result.smartInsight && (
        <div className="mb-6 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-sans leading-relaxed">{result.smartInsight}</span>
        </div>
      )}

      {/* Main Score & WPM Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        
        {/* HUGE WPM HERO */}
        <div className="sm:col-span-2 bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent dark:from-cyan-950/30 dark:via-sky-950/15 dark:to-[#0f172a] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              NET WORDS PER MINUTE
            </span>
            <span className="text-xs text-slate-400">
              Raw: {result.rawWpm} WPM
            </span>
          </div>

          <div className="my-4 flex items-baseline gap-3">
            <span className="text-6xl sm:text-7xl font-black text-cyan-400 tracking-tight">
              {result.wpm}
            </span>
            <span className="text-xl font-bold text-slate-400">
              WPM
            </span>
          </div>

          {/* Factual Comparisons */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {wpmDiffPrev !== null && (
              <span className={`flex items-center gap-0.5 font-bold ${wpmDiffPrev >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {wpmDiffPrev >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {wpmDiffPrev >= 0 ? `+${wpmDiffPrev}` : wpmDiffPrev} WPM from previous test
              </span>
            )}
            <span className="text-slate-400">
              {wpmDiffAvg >= 0 ? `+${wpmDiffAvg}` : wpmDiffAvg} WPM from average
            </span>
          </div>
        </div>

        {/* PERFORMANCE SCORE */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Performance Score
            </span>
            <div className="text-5xl font-extrabold text-slate-900 dark:text-white my-3 tracking-tight">
              {result.score}
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 font-sans">
            Session Rating: <strong className="text-cyan-400 font-mono">{result.sessionRating}</strong> · Based on speed, accuracy, and cadence consistency.
          </div>
        </div>

      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 uppercase flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-sky-500" />
            Accuracy
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {result.accuracy.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 uppercase flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            Errors Made
          </span>
          <div className={`text-2xl font-bold mt-1 ${result.errors > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
            {result.errors}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4" title="How stable your typing speed remained throughout the test">
          <span className="text-xs text-slate-400 uppercase flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            Consistency
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {result.consistency}%
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Characters
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {result.correctChars} <span className="text-xs font-normal text-slate-400">/ {result.totalChars}</span>
          </div>
        </div>
      </div>

      {/* Advanced Error & Word Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        
        {/* ERROR ANALYSIS */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Error & Mistake Analysis
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Error Rate:</span>
              <span className="text-slate-200 font-bold">{result.errorAnalysis?.errorRate || 0}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Most Mistyped Key:</span>
              <span className="text-rose-400 font-bold">
                {result.errorAnalysis?.mostMistypedKey ? `"${result.errorAnalysis.mostMistypedKey.key.toUpperCase()}" (${result.errorAnalysis.mostMistypedKey.count}x)` : 'None'}
              </span>
            </div>
            <div className="py-1">
              <span className="text-slate-400 block mb-1">Common Mistake Pairs:</span>
              <div className="flex flex-wrap gap-1.5">
                {result.errorAnalysis?.commonMistakes && result.errorAnalysis.commonMistakes.length > 0 ? (
                  result.errorAnalysis.commonMistakes.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px]">
                      {m.from.toUpperCase()} → {m.to.toUpperCase()} ({m.count}x)
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-400 text-xs">Clean run · Zero mistake clusters!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* WORD ANALYSIS */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-500" />
            Word-Level Diagnostics
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Fastest Word:</span>
              <span className="text-cyan-400 font-bold">
                {result.wordAnalysis?.fastestWord?.word ? `"${result.wordAnalysis.fastestWord.word}" (${result.wordAnalysis.fastestWord.wpm} WPM)` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Slowest Word:</span>
              <span className="text-slate-300 font-bold">
                {result.wordAnalysis?.slowestWord?.word ? `"${result.wordAnalysis.slowestWord.word}" (${result.wordAnalysis.slowestWord.wpm} WPM)` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Longest Word:</span>
              <span className="text-slate-300 font-bold">
                {result.wordAnalysis?.longestWord?.word ? `"${result.wordAnalysis.longestWord.word}" (${result.wordAnalysis.longestWord.length} chars)` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Performance Graph Panel */}
      <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Speed Curve Over Time
          </h3>
          <span className="text-xs text-slate-400">
            {result.metricsHistory.length} Samples
          </span>
        </div>

        <PerformanceGraph
          metrics={result.metricsHistory}
          duration={result.duration || 30}
          height={160}
          showLabels={true}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onTryAgain}
          className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>TRY AGAIN (ENTER)</span>
        </button>

        <button
          onClick={onChangeMode}
          className="px-6 py-3.5 rounded-xl font-semibold text-xs text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Sliders className="w-4 h-4" />
          <span>CHANGE MODE</span>
        </button>

        <button
          onClick={handleCopySummary}
          className="px-5 py-3.5 rounded-xl font-semibold text-xs text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'COPIED!' : 'COPY SUMMARY'}</span>
        </button>

        <button
          onClick={handleShare}
          className="px-5 py-3.5 rounded-xl font-semibold text-xs text-slate-300 bg-transparent hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>SHARE</span>
        </button>
      </div>

    </div>
  );
};
