import React from 'react';
import { X, Zap, ShieldCheck, Target, Gauge, Activity, Cpu } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                TYPE<span className="text-cyan-500">RUSH</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type faster. Think sharper.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 py-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            <strong className="text-slate-900 dark:text-white font-semibold">TYPERUSH</strong> is a precision real-time typing speed and accuracy testing suite built for competitive typists, developers, and live judging demonstrations.
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              Core Metric Formulas:
            </div>

            <div className="flex items-start gap-2.5">
              <Gauge className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Net WPM:</strong>
                <span className="text-slate-500 dark:text-slate-400 block font-mono text-[11px]">
                  (Correct Characters / 5) / Elapsed Minutes
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Target className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Accuracy:</strong>
                <span className="text-slate-500 dark:text-slate-400 block font-mono text-[11px]">
                  (Correct Characters / Total Typed Characters) × 100
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Consistency:</strong>
                <span className="text-slate-500 dark:text-slate-400 block font-mono text-[11px]">
                  100 − (StdDev of Per-Second WPM / Mean WPM × 100)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">Performance Score:</strong>
                <span className="text-slate-500 dark:text-slate-400 block font-mono text-[11px]">
                  WPM × Accuracy × Difficulty Multiplier × Consistency Factor
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[11px]">
              100% Client-Side. No external tracking, zero server latency, and offline-ready.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
