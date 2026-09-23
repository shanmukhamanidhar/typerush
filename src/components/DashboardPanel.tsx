import React from 'react';
import { Trophy, Gauge, Target, Award, Clock, ArrowRight } from 'lucide-react';
import { TestResult, PersonalBests } from '../types/typing';

interface DashboardPanelProps {
  history: TestResult[];
  personalBests: PersonalBests;
  onStartTest: () => void;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  history,
  personalBests,
  onStartTest,
}) => {
  const testsCompleted = history.length;

  const averageWpm = testsCompleted > 0
    ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / testsCompleted)
    : 0;

  const averageAccuracy = testsCompleted > 0
    ? parseFloat((history.reduce((acc, h) => acc + h.accuracy, 0) / testsCompleted).toFixed(1))
    : 0;

  const totalCharsTyped = history.reduce((acc, h) => acc + h.totalChars, 0);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 animate-fadeIn">
      
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Performance Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Aggregated typing metrics and lifetime records computed from your local test history.
        </p>
      </div>

      {testsCompleted === 0 ? (
        <div className="w-full text-center py-16 px-4 bg-white dark:bg-[#0f172a]/60 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center mb-4">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            No statistics available yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Take a typing test to unlock your speed metrics, accuracy trends, and personal best records.
          </p>
          <button
            onClick={onStartTest}
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/25 transition-all inline-flex items-center gap-2"
          >
            <span>TAKE YOUR FIRST TEST</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Lifetime Records Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            
            <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                All-Time Best WPM
              </span>
              <div className="text-4xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
                {personalBests.bestWpm || 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Peak typing speed
              </span>
            </div>

            <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                <Gauge className="w-4 h-4 text-cyan-500" />
                Average WPM
              </span>
              <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                {averageWpm}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Across {testsCompleted} sessions
              </span>
            </div>

            <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-sky-500" />
                Average Accuracy
              </span>
              <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                {averageAccuracy}%
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Best: {personalBests.bestAccuracy || 0}%
              </span>
            </div>

            <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                <Award className="w-4 h-4 text-purple-500" />
                Highest Score
              </span>
              <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                {personalBests.bestScore || 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Best composite rating
              </span>
            </div>

          </div>

          {/* Mode-Specific Bests Grid */}
          <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              Duration Records
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">15s Sprint</div>
                <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                  {personalBests.best15s || 0} <span className="text-xs text-slate-400 font-sans">WPM</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">30s Standard</div>
                <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                  {personalBests.best30s || 0} <span className="text-xs text-slate-400 font-sans">WPM</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">60s Endurance</div>
                <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                  {personalBests.best60s || 0} <span className="text-xs text-slate-400 font-sans">WPM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent 5 Sessions */}
          <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
                Recent Sessions
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Total Chars: {totalCharsTyped}
              </span>
            </div>

            <div className="space-y-2">
              {history.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                      {session.wpm} WPM
                    </span>
                    <span className="text-slate-400">
                      {session.accuracy.toFixed(1)}% Acc
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                      {session.duration}s · {session.difficulty}
                    </span>
                  </div>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {session.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
