import React from 'react';
import { X, ShieldCheck, Target, Gauge, Activity, Cpu } from 'lucide-react';
import { TypeRushLogo } from './TypeRushLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <TypeRushLogo variant="full" size="md" showProBadge={true} />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E5E5] dark:hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 py-5 text-xs text-[#666666] dark:text-[#A1A1AA] leading-relaxed font-sans">
          <p>
            <strong className="text-[#111111] dark:text-white font-semibold">TYPERUSH</strong> is a precision real-time typing speed and accuracy testing suite built for competitive typists, developers, and live judging demonstrations.
          </p>

          <div className="bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-4 space-y-3">
            <div className="font-bold text-[#111111] dark:text-white uppercase tracking-wider text-[11px] font-mono">
              Core Metric Formulas:
            </div>

            <div className="flex items-start gap-2.5">
              <Gauge className="w-4 h-4 text-[#FF5A00] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] dark:text-white">Net WPM:</strong>
                <span className="text-[#666666] dark:text-[#71717A] block font-mono text-[11px]">
                  (Correct Characters / 5) / Elapsed Minutes
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Target className="w-4 h-4 text-[#FF6E1A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] dark:text-white">Accuracy:</strong>
                <span className="text-[#666666] dark:text-[#71717A] block font-mono text-[11px]">
                  (Correct Characters / Total Typed Characters) × 100
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-[#FF6E1A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] dark:text-white">Consistency:</strong>
                <span className="text-[#666666] dark:text-[#71717A] block font-mono text-[11px]">
                  100 − (StdDev of Per-Second WPM / Mean WPM × 100)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-[#FFA347] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] dark:text-white">Performance Score:</strong>
                <span className="text-[#666666] dark:text-[#71717A] block font-mono text-[11px]">
                  WPM × Accuracy × Difficulty Multiplier × Consistency Factor
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/20 text-[#FF5A00]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[11px] text-[#111111] dark:text-white">
              100% Client-Side. No external tracking, zero server latency, and offline-ready.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#FF5A00] text-black hover:shadow-[0_0_16px_rgba(255,90,0,0.4)] transition-all"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
