import React from 'react';
import { Gauge, Target, AlertCircle, Timer, Flame, Activity } from 'lucide-react';

interface MetricsBarProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  formattedTime: string;
  isLowTime: boolean;
  progress: number;
  streak: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  wpm,
  rawWpm,
  accuracy,
  errors,
  formattedTime,
  isLowTime,
  progress,
  streak,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {/* Top HUD Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
        
        {/* WPM Card */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm transition-all hover:border-cyan-500/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-500" />
              WPM
            </span>
            <span className="text-[10px] font-mono text-slate-400" title="Gross WPM including errors">
              RAW {rawWpm}
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400 tracking-tight">
            {wpm}
          </div>
        </div>

        {/* ACCURACY Card */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm transition-all hover:border-cyan-500/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-sky-500" />
              ACCURACY
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tracking-tight">
            {accuracy.toFixed(1)}<span className="text-base font-normal text-slate-400">%</span>
          </div>
        </div>

        {/* ERRORS Card */}
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm transition-all hover:border-rose-500/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              ERRORS
            </span>
          </div>
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${errors > 0 ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
            {errors}
          </div>
        </div>

        {/* TIMER Card with low-time urgency warning */}
        <div className={`bg-white dark:bg-[#0f172a]/90 border rounded-xl p-3.5 shadow-sm transition-all ${
          isLowTime 
            ? 'border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10 text-amber-500 animate-pulse ring-1 ring-amber-500/40' 
            : 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-semibold uppercase tracking-wider flex items-center gap-1 ${
              isLowTime ? 'text-amber-500 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              TIME
            </span>
            {isLowTime && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                FINAL
              </span>
            )}
          </div>
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${
            isLowTime ? 'text-amber-500' : 'text-slate-900 dark:text-slate-100'
          }`}>
            {formattedTime}
          </div>
        </div>

        {/* STREAK & PROGRESS Card */}
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm transition-all hover:border-cyan-500/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-orange-500" />
              COMBO
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {progress}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 font-mono font-bold text-2xl ${
              streak >= 20 ? 'text-orange-500 animate-bounce' : streak > 0 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'
            }`}>
              <Flame className={`w-5 h-5 ${streak >= 10 ? 'fill-current' : ''}`} />
              <span>{streak}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
