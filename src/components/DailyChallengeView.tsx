import React from 'react';
import { Calendar, Trophy, Flame, Play, CheckCircle2, Sparkles, Target, Zap } from 'lucide-react';
import { DailyChallengeRecord } from '../types/typing';
import { getDeterministicDailyChallenge } from '../data/expandedPassages';

interface DailyChallengeViewProps {
  todayRecord?: DailyChallengeRecord;
  onStartChallenge: (passage: string, difficulty: 'medium' | 'hard', category: any) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  todayRecord,
  onStartChallenge,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyData = getDeterministicDailyChallenge(todayStr);

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-fadeIn font-mono">
      <div className="bg-white dark:bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
              <Calendar className="w-3 h-3" />
              GLOBAL DAILY PROTOCOL
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Today's Challenge
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {formattedDate} · Synchronized for all typists worldwide
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </div>

        {/* Passage Preview Card */}
        <div className="my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-bold text-cyan-500">Target Passage Preview</span>
            <span className="capitalize">{dailyData.difficulty} · {dailyData.category}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed italic line-clamp-3">
            "{dailyData.passage}"
          </p>
        </div>

        {/* Today's Performance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Attempts Today</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {todayRecord?.attempts || 0}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Today's Best WPM</span>
            <div className="text-2xl font-black text-cyan-500 mt-1">
              {todayRecord?.bestWpm || 0} <span className="text-xs text-slate-400">WPM</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              {todayRecord?.completed ? (
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  COMPLETED
                </span>
              ) : (
                <span className="text-amber-500 font-bold text-sm">
                  NOT COMPLETED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStartChallenge(dailyData.passage, dailyData.difficulty, dailyData.category)}
          className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{todayRecord?.completed ? 'ATTEMPT AGAIN TO IMPROVE BEST' : 'START DAILY CHALLENGE'}</span>
        </button>

      </div>
    </div>
  );
};
