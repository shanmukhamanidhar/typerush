import React from 'react';
import { X, HelpCircle, Gauge, Target, Keyboard, Zap, Shield, Flame } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              TYPERUSH Guide & Shortcuts
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 py-4 text-xs font-sans text-slate-600 dark:text-slate-300">
          
          {/* WPM & Accuracy */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-mono space-y-2">
            <span className="font-bold text-cyan-500 uppercase block text-[11px]">Telemetry Formulas</span>
            <div>
              <strong className="text-slate-900 dark:text-white">Net WPM: </strong>
              <span className="text-slate-400">(Correct Characters / 5) / Elapsed Minutes</span>
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Accuracy: </strong>
              <span className="text-slate-400">(Correct Characters / Total Typed) × 100</span>
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Consistency: </strong>
              <span className="text-slate-400">100 - Cadence Standard Deviation Percentage</span>
            </div>
          </div>

          {/* Test Modes Overview */}
          <div>
            <h4 className="font-bold font-mono text-slate-900 dark:text-white uppercase mb-2 text-xs">
              Available Test Modes:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-cyan-400">TIME:</span> 15s, 30s, or 60s competitive sprint.
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-cyan-400">WORDS:</span> 10, 25, 50, or 100 word fixed goals.
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-cyan-400">QUOTE:</span> Famous quotes with author attribution.
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-cyan-400">CODE:</span> Real snippets in C, Python, JS, SQL, etc.
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h4 className="font-bold font-mono text-slate-900 dark:text-white uppercase mb-2 text-xs">
              Platform Keyboard Shortcuts:
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Start Test / Launch:</span>
                <span className="font-bold text-cyan-400">ENTER</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Reset / Pause Active Test:</span>
                <span className="font-bold text-cyan-400">ESCAPE</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Try Again on Results:</span>
                <span className="font-bold text-cyan-400">ENTER</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
