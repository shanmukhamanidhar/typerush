import React from 'react';
import { X, HelpCircle, Gauge, Target, Keyboard, Zap, Shield, Flame } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#FF5A00]/10 text-[#FF5A00]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#111111] dark:text-white">
              TYPERUSH Guide & Shortcuts
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E5E5] dark:hover:bg-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 py-4 text-xs font-sans text-[#666666] dark:text-[#A1A1AA]">
          
          {/* WPM & Accuracy */}
          <div className="p-4 rounded-xl bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A] font-mono space-y-2">
            <span className="font-bold text-[#FF5A00] uppercase block text-[11px]">Telemetry Formulas</span>
            <div>
              <strong className="text-[#111111] dark:text-white">Net WPM: </strong>
              <span className="text-[#666666] dark:text-[#71717A]">(Correct Characters / 5) / Elapsed Minutes</span>
            </div>
            <div>
              <strong className="text-[#111111] dark:text-white">Accuracy: </strong>
              <span className="text-[#666666] dark:text-[#71717A]">(Correct Characters / Total Typed) × 100</span>
            </div>
            <div>
              <strong className="text-[#111111] dark:text-white">Consistency: </strong>
              <span className="text-[#666666] dark:text-[#71717A]">100 - Cadence Standard Deviation Percentage</span>
            </div>
          </div>

          {/* Test Modes Overview */}
          <div>
            <h4 className="font-bold font-mono text-[#111111] dark:text-white uppercase mb-2 text-xs">
              Available Test Modes:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="font-bold text-[#FF5A00]">TIME:</span> 15s, 30s, or 60s competitive sprint.
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="font-bold text-[#FF5A00]">WORDS:</span> 10, 25, 50, or 100 word fixed goals.
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="font-bold text-[#FF5A00]">QUOTE:</span> Famous quotes with author attribution.
              </div>
              <div className="p-2.5 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="font-bold text-[#FF5A00]">CODE:</span> Real snippets in C, Python, JS, SQL, etc.
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h4 className="font-bold font-mono text-[#111111] dark:text-white uppercase mb-2 text-xs">
              Platform Keyboard Shortcuts:
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#666666] dark:text-[#71717A]">Start Test / Launch:</span>
                <span className="font-bold text-[#FF5A00]">ENTER</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#666666] dark:text-[#71717A]">Reset / Pause Active Test:</span>
                <span className="font-bold text-[#FF5A00]">ESCAPE</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#666666] dark:text-[#71717A]">Try Again on Results:</span>
                <span className="font-bold text-[#FF5A00]">ENTER</span>
              </div>
            </div>
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
