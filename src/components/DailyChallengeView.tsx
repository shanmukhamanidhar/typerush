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
      <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-2xl">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-2">
              <Calendar className="w-3 h-3" />
              GLOBAL DAILY PROTOCOL
            </span>
            <h1 className="text-3xl font-black text-[#111111] dark:text-white">
              Today's Challenge
            </h1>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans mt-0.5">
              {formattedDate} · Synchronized for all typists worldwide
            </p>
          </div>

          <div className="w-12 h-12 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] font-bold flex items-center justify-center shadow-lg shadow-[#FF5A00]/20">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </div>

        {/* Passage Preview Card */}
        <div className="my-6 p-5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center justify-between text-xs text-[#666666] dark:text-[#71717A] mb-2 font-bold">
            <span className="uppercase text-[#FF5A00]">Target Passage Preview</span>
            <span className="capitalize">{dailyData.difficulty} · {dailyData.category}</span>
          </div>
          <p className="text-sm text-[#111111] dark:text-white font-sans leading-relaxed italic line-clamp-3">
            "{dailyData.passage}"
          </p>
        </div>

        {/* Today's Performance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Attempts Today</span>
            <div className="text-2xl font-black text-[#111111] dark:text-white mt-1">
              {todayRecord?.attempts || 0}
            </div>
          </div>

          <div className="p-3.5 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Today's Best WPM</span>
            <div className="text-2xl font-black text-[#FF5A00] mt-1">
              {todayRecord?.bestWpm || 0} <span className="text-xs text-[#666666] dark:text-[#71717A]">WPM</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 bg-[#F7F7F7] dark:bg-[#080808] rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] text-[#666666] dark:text-[#71717A] uppercase font-bold">Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              {todayRecord?.completed ? (
                <span className="text-[#FF5A00] font-bold text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  COMPLETED
                </span>
              ) : (
                <span className="text-neutral-400 font-bold text-sm">
                  NOT COMPLETED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStartChallenge(dailyData.passage, dailyData.difficulty, dailyData.category)}
          className="w-full py-4 rounded-lg font-black text-xs uppercase tracking-wider text-black bg-[#FF5A00] hover:brightness-110 shadow-lg shadow-[#FF5A00]/25 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{todayRecord?.completed ? 'ATTEMPT AGAIN TO IMPROVE BEST' : 'START DAILY CHALLENGE'}</span>
        </button>

      </div>
    </div>
  );
};
