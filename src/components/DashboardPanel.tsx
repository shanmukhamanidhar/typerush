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
      <div className="mb-6 font-mono">
        <h2 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
          Performance Dashboard
        </h2>
        <p className="text-xs text-[#666666] dark:text-[#A1A1AA] mt-1 font-sans">
          Aggregated typing metrics and lifetime records computed from your local test history.
        </p>
      </div>

      {testsCompleted === 0 ? (
        <div className="w-full text-center py-16 px-4 bg-white dark:bg-[#111111] border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/20 flex items-center justify-center mb-4">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-2 font-mono">
            No statistics available yet
          </h3>
          <p className="text-sm text-[#666666] dark:text-[#A1A1AA] max-w-md mx-auto mb-6">
            Take a typing test to unlock your speed metrics, accuracy trends, and personal best records.
          </p>
          <button
            onClick={onStartTest}
            className="px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-[#FF5A00] hover:shadow-[0_0_16px_rgba(255,90,0,0.4)] transition-all inline-flex items-center gap-2"
          >
            <span>TAKE YOUR FIRST TEST</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Lifetime Records Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            
            <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF5A00]/40 rounded-xl p-5 shadow-sm transition-colors">
              <span className="text-xs font-mono uppercase text-[#666666] dark:text-[#A1A1AA] flex items-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4 text-[#FF5A00]" />
                All-Time Best WPM
              </span>
              <div className="text-4xl font-extrabold font-mono text-[#FF5A00] drop-shadow-[0_0_12px_rgba(255,90,0,0.35)]">
                {personalBests.bestWpm || 0}
              </div>
              <span className="text-[11px] text-[#888888] dark:text-[#71717A] mt-1 block">
                Peak typing speed
              </span>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-5 shadow-sm">
              <span className="text-xs font-mono uppercase text-[#666666] dark:text-[#A1A1AA] flex items-center gap-1.5 mb-1">
                <Gauge className="w-4 h-4 text-[#FF6E1A]" />
                Average WPM
              </span>
              <div className="text-4xl font-extrabold font-mono text-[#111111] dark:text-white">
                {averageWpm}
              </div>
              <span className="text-[11px] text-[#888888] dark:text-[#71717A] mt-1 block">
                Across {testsCompleted} sessions
              </span>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-5 shadow-sm">
              <span className="text-xs font-mono uppercase text-[#666666] dark:text-[#A1A1AA] flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-[#FF6E1A]" />
                Average Accuracy
              </span>
              <div className="text-4xl font-extrabold font-mono text-[#FF6E1A]">
                {averageAccuracy}%
              </div>
              <span className="text-[11px] text-[#888888] dark:text-[#71717A] mt-1 block">
                Best: {personalBests.bestAccuracy || 0}%
              </span>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-5 shadow-sm">
              <span className="text-xs font-mono uppercase text-[#666666] dark:text-[#A1A1AA] flex items-center gap-1.5 mb-1">
                <Award className="w-4 h-4 text-[#FF6E1A]" />
                Highest Score
              </span>
              <div className="text-4xl font-extrabold font-mono text-[#111111] dark:text-white">
                {personalBests.bestScore || 0}
              </div>
              <span className="text-[11px] text-[#888888] dark:text-[#71717A] mt-1 block">
                Best composite rating
              </span>
            </div>

          </div>

          {/* Mode-Specific Bests Grid */}
          <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-5 sm:p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#111111] dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF5A00]" />
              Duration Records
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-xs font-mono text-[#666666] dark:text-[#71717A] uppercase">15s Sprint</div>
                <div className="text-2xl font-bold font-mono text-[#FF5A00] mt-1">
                  {personalBests.best15s || 0} <span className="text-xs text-[#888888] dark:text-[#71717A] font-sans">WPM</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-xs font-mono text-[#666666] dark:text-[#71717A] uppercase">30s Standard</div>
                <div className="text-2xl font-bold font-mono text-[#FF5A00] mt-1">
                  {personalBests.best30s || 0} <span className="text-xs text-[#888888] dark:text-[#71717A] font-sans">WPM</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="text-xs font-mono text-[#666666] dark:text-[#71717A] uppercase">60s Endurance</div>
                <div className="text-2xl font-bold font-mono text-[#FF5A00] mt-1">
                  {personalBests.best60s || 0} <span className="text-xs text-[#888888] dark:text-[#71717A] font-sans">WPM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent 5 Sessions */}
          <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#111111] dark:text-white">
                Recent Sessions
              </h3>
              <span className="text-xs font-mono text-[#666666] dark:text-[#71717A]">
                Total Chars: {totalCharsTyped}
              </span>
            </div>

            <div className="space-y-2">
              {history.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#FF5A00] text-sm">
                      {session.wpm} WPM
                    </span>
                    <span className="text-[#FF6E1A]">
                      {session.accuracy.toFixed(1)}% Acc
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#666666] dark:text-[#71717A] uppercase">
                      {session.duration}s · {session.difficulty}
                    </span>
                  </div>

                  <span className="font-semibold text-[#111111] dark:text-white">
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
