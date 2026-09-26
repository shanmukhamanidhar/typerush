import React from 'react';
import { ShieldCheck, Cpu, Code2, Gauge, Activity, Sparkles, Terminal } from 'lucide-react';
import { TestResult, PersonalBests } from '../../types/typing';
import { StatisticsService } from '../../services/statisticsService';
import { WpmDistributionChart } from './WpmDistributionChart';

interface AboutPageProps {
  history?: TestResult[];
  personalBests?: PersonalBests;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  history = [],
  personalBests,
}) => {
  const userStats = StatisticsService.getUserStats(history);
  const userBestWpm = personalBests?.bestWpm || 0;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 select-none font-mono animate-fadeIn space-y-12 text-[#111111] dark:text-[#F5F5F5]">
      
      {/* Top Hero Introduction */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#FF5A00] font-semibold block">
          Platform Architecture & Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
          Built for focused typing.
        </h1>
        <p className="text-sm text-[#646669] dark:text-[#A1A1A1] max-w-2xl leading-relaxed">
          TypeRush is a minimalist, precision typing performance instrument designed to cultivate fluid finger cadence, muscular memory, and high-accuracy consistency without visual clutter, gaming distractions, or invasive telemetry.
        </p>
      </div>

      {/* Real Verified User Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-[#E5E5E5] dark:border-[#222222]">
        <div>
          <span className="text-[11px] text-[#646669] uppercase tracking-wider block mb-1">
            Tests Completed
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#FF5A00] tracking-tight">
            {userStats.totalTestsCompleted > 0 ? userStats.totalTestsCompleted : '—'}
          </span>
          <span className="text-[10px] text-[#646669] block mt-1">Verified Sessions</span>
        </div>

        <div>
          <span className="text-[11px] text-[#646669] uppercase tracking-wider block mb-1">
            Total Time Typed
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            {userStats.totalTestsCompleted > 0 ? userStats.formattedTypingTime : '—'}
          </span>
          <span className="text-[10px] text-[#646669] block mt-1">Accumulated Practice</span>
        </div>

        <div>
          <span className="text-[11px] text-[#646669] uppercase tracking-wider block mb-1">
            Average Speed
          </span>
          <span className="text-3xl sm:text-4xl font-black text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            {userStats.averageWpm > 0 ? `${userStats.averageWpm} WPM` : '—'}
          </span>
          <span className="text-[10px] text-[#646669] block mt-1">All Recorded Modes</span>
        </div>
      </div>

      {/* Speed Distribution Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#111111] dark:text-[#F5F5F5] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF5A00]" />
            <span>WPM Distribution Curve</span>
          </h2>
          <p className="text-xs text-[#646669] dark:text-[#A1A1A1] mt-1">
            Calculated strictly from your completed tests to reveal your natural typing speed distribution across sessions.
          </p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01]">
          <WpmDistributionChart history={history} userWpm={userBestWpm} />
        </div>
      </div>

      {/* Technical Documentation & Methodology */}
      <div className="space-y-6 pt-6 border-t border-[#E5E5E5] dark:border-[#222222]">
        <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-[#F5F5F5]">
          About TypeRush Engineering
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#646669] dark:text-[#A1A1A1]">
          
          {/* Card 1: WPM Formula */}
          <div className="p-4 rounded-lg border border-[#E5E5E5] dark:border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5] font-bold">
              <Gauge className="w-4 h-4 text-[#FF5A00]" />
              <span>Standard WPM Calculation</span>
            </div>
            <p className="leading-relaxed">
              In accordance with international typing measurement standards, one word is standardized to exactly 5 keystrokes (characters):
            </p>
            <div className="p-2 rounded bg-black/5 dark:bg-white/5 font-mono text-[11px] text-[#FF5A00]">
              WPM = (correct characters / 5) / elapsed minutes
            </div>
            <p className="text-[11px] leading-relaxed">
              Uncorrected errors are not credited, providing an authentic measure of productive human typing output.
            </p>
          </div>

          {/* Card 2: Accuracy & Consistency */}
          <div className="p-4 rounded-lg border border-[#E5E5E5] dark:border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5] font-bold">
              <Sparkles className="w-4 h-4 text-[#FF5A00]" />
              <span>Accuracy & Consistency</span>
            </div>
            <p className="leading-relaxed">
              Accuracy measures the exact ratio of valid characters submitted against total keystrokes:
            </p>
            <div className="p-2 rounded bg-black/5 dark:bg-white/5 font-mono text-[11px] text-[#FF5A00]">
              Accuracy = (correct characters / total typed) × 100
            </div>
            <p className="text-[11px] leading-relaxed">
              Consistency evaluates the variance across rolling 1-second interval cadence snapshots. Higher percentages indicate steady, metronomic finger rhythm.
            </p>
          </div>

          {/* Card 3: Modes & Custom Text */}
          <div className="p-4 rounded-lg border border-[#E5E5E5] dark:border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5] font-bold">
              <Code2 className="w-4 h-4 text-[#FF5A00]" />
              <span>Supported Test Modes</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-[11px]">
              <li><strong className="text-[#111111] dark:text-[#F5F5F5]">Time:</strong> Sprint intervals (15s, 30s, 60s, 120s) with endless buffer replenishing.</li>
              <li><strong className="text-[#111111] dark:text-[#F5F5F5]">Words:</strong> Fixed-target word counts (10, 25, 50, 100).</li>
              <li><strong className="text-[#111111] dark:text-[#F5F5F5]">Quote:</strong> Curated literary, philosophical, and scientific passages.</li>
              <li><strong className="text-[#111111] dark:text-[#F5F5F5]">Zen:</strong> Freeform un-timed buffer for meditative typing.</li>
              <li><strong className="text-[#111111] dark:text-[#F5F5F5]">Custom:</strong> Paste customized practice text, drills, or source code.</li>
            </ul>
          </div>

          {/* Card 4: Privacy & Technology */}
          <div className="p-4 rounded-lg border border-[#E5E5E5] dark:border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-[#111111] dark:text-[#F5F5F5] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
              <span>Privacy & Tech Stack</span>
            </div>
            <p className="leading-relaxed">
              TypeRush operates 100% in your browser. All test metrics, heatmaps, settings, and personal bests are stored locally in your browser's persistent storage. Zero telemetry or keystroke logging.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#646669]">
              <Cpu className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Engineered with React 18, TypeScript, Tailwind CSS, & Vite.</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
