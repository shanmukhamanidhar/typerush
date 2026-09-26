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
    <div className="w-full max-w-4xl mx-auto mb-6 font-mono">
      {/* Top HUD Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
        
        {/* WPM Card */}
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm transition-all hover:border-[#FF5A00]/40">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-[#FF5A00]" />
              WPM
            </span>
            <span className="text-[10px] font-mono text-[#6B6B6B] dark:text-[#A1A1AA]" title="Gross WPM including errors">
              RAW {rawWpm}
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#FF5A00] tracking-tight dark:drop-shadow-[0_0_12px_rgba(255,90,0,0.3)]">
            {wpm}
          </div>
        </div>

        {/* ACCURACY Card */}
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm transition-all hover:border-[#FF6E1A]/40">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#FF6E1A]" />
              ACCURACY
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            {accuracy.toFixed(1)}<span className="text-base font-normal text-[#FF6E1A]">%</span>
          </div>
        </div>

        {/* ERRORS Card */}
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm transition-all hover:border-[#D95400]/40">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#D95400]" />
              ERRORS
            </span>
          </div>
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${errors > 0 ? 'text-[#D95400] drop-shadow-[0_0_8px_rgba(217,84,0,0.3)]' : 'text-[#6B6B6B] dark:text-[#555555]'}`}>
            {errors}
          </div>
        </div>

        {/* TIMER Card with low-time urgency warning */}
        <div className={`bg-white dark:bg-[#111111] border rounded-2xl p-3.5 shadow-sm transition-all ${
          isLowTime 
            ? 'border-[#D95400] bg-[#D95400]/10 text-[#D95400] animate-pulse shadow-[0_0_12px_rgba(217,84,0,0.2)]' 
            : 'border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF5A00]/40'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-semibold uppercase tracking-wider flex items-center gap-1 ${
              isLowTime ? 'text-[#D95400] font-bold' : 'text-[#6B6B6B] dark:text-[#A1A1AA]'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              TIME
            </span>
            {isLowTime && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D95400]">
                FINAL
              </span>
            )}
          </div>
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${
            isLowTime ? 'text-[#D95400]' : 'text-[#111111] dark:text-[#F5F5F5]'
          }`}>
            {formattedTime}
          </div>
        </div>

        {/* STREAK & PROGRESS Card */}
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm transition-all hover:border-[#FF5A00]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] dark:text-[#A1A1AA] mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#FF5A00]" />
              COMBO
            </span>
            <span className="text-[10px] font-mono text-[#6B6B6B] dark:text-[#A1A1AA]">
              {progress}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 font-mono font-bold text-2xl ${
              streak >= 20 ? 'text-[#FF5A00] drop-shadow-[0_0_8px_rgba(255,90,0,0.4)]' : streak > 0 ? 'text-[#FF6E1A]' : 'text-[#6B6B6B] dark:text-[#555555]'
            }`}>
              <Flame className={`w-5 h-5 ${streak >= 10 ? 'fill-current' : ''}`} />
              <span>{streak}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#FF5A00] to-[#FF6E1A] h-full transition-all duration-150 ease-out shadow-[0_0_8px_rgba(255,90,0,0.3)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
