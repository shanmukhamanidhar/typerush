import React, { useState } from 'react';
import { 
  X, 
  Coffee, 
  Target, 
  Zap, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Trash2, 
  Play,
  CheckCircle2
} from 'lucide-react';
import { 
  getStoredWeaknesses, 
  saveWeaknesses, 
  generateMissedWordsDrill, 
  generateBiwordDrill 
} from '../data/practiceEngine';

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDrill: (passage: string, title: string) => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  isOpen,
  onClose,
  onStartDrill,
}) => {
  const [drillType, setDrillType] = useState<'missed' | 'biwords' | 'custom'>('missed');
  const [customWordsInput, setCustomWordsInput] = useState<string>('');
  const weaknesses = getStoredWeaknesses();

  if (!isOpen) return null;

  const topMissed = Object.entries(weaknesses.missedWords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const topBiwords = Object.entries(weaknesses.missedBigrams)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const handleLaunch = () => {
    if (drillType === 'missed') {
      const drill = generateMissedWordsDrill();
      onStartDrill(drill.passage, 'Missed Words Targeted Drill');
      onClose();
    } else if (drillType === 'biwords') {
      const drill = generateBiwordDrill();
      onStartDrill(drill.passage, 'Biwords Precision Drill');
      onClose();
    } else if (drillType === 'custom') {
      const words = customWordsInput
        .split(/[,;\s]+/)
        .map(w => w.trim())
        .filter(w => w.length > 0);

      if (words.length === 0) return;

      // Repeat words into a practice passage
      const fullDrill: string[] = [];
      for (let i = 0; i < 25; i++) {
        fullDrill.push(words[Math.floor(Math.random() * words.length)]);
      }
      onStartDrill(fullDrill.join(' '), 'Custom Vocabulary Drill');
      onClose();
    }
  };

  const handleClearWeaknesses = () => {
    saveWeaknesses({ missedWords: {}, slowWords: {}, missedBigrams: {} });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 sm:p-8 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/20">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#111111] dark:text-white">
                Targeted Practice Lab
              </h3>
              <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans">
                Train your muscle memory with precision drills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E5E5] dark:hover:bg-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drill Type Selector */}
        <div className="grid grid-cols-3 gap-2 mt-5 mb-5">
          <button
            onClick={() => setDrillType('missed')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
              drillType === 'missed'
                ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-bold shadow-[0_0_12px_rgba(255,90,0,0.15)]'
                : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#080808] hover:border-[#FF5A00]/40 text-[#666666] dark:text-[#A1A1AA]'
            }`}
          >
            <Target className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Missed Words</span>
            <span className="text-[10px] text-[#888888] dark:text-[#71717A] font-sans">Top errors</span>
          </button>

          <button
            onClick={() => setDrillType('biwords')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
              drillType === 'biwords'
                ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-bold shadow-[0_0_12px_rgba(255,90,0,0.15)]'
                : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#080808] hover:border-[#FF5A00]/40 text-[#666666] dark:text-[#A1A1AA]'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Biwords</span>
            <span className="text-[10px] text-[#888888] dark:text-[#71717A] font-sans">Letter pairs</span>
          </button>

          <button
            onClick={() => setDrillType('custom')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
              drillType === 'custom'
                ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-bold shadow-[0_0_12px_rgba(255,90,0,0.15)]'
                : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#080808] hover:border-[#FF5A00]/40 text-[#666666] dark:text-[#A1A1AA]'
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Custom Drill</span>
            <span className="text-[10px] text-[#888888] dark:text-[#71717A] font-sans">User word list</span>
          </button>
        </div>

        {/* Content Details */}
        {drillType === 'missed' && (
          <div className="bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-4 mb-5">
            <span className="text-xs font-bold text-[#111111] dark:text-white block mb-2">
              Detected Mistyped Words
            </span>
            {topMissed.length === 0 ? (
              <p className="text-xs text-[#888888] dark:text-[#71717A] font-sans py-2">
                No mistakes recorded yet. Take a few tests to automatically diagnose tricky words!
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {topMissed.map(([w, count]) => (
                  <span key={w} className="px-2.5 py-1 rounded-lg bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 text-[#FF3B5C] text-xs font-bold flex items-center gap-1.5">
                    <span>{w}</span>
                    <span className="text-[10px] opacity-80">({count}×)</span>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[11px] text-[#666666] dark:text-[#71717A] font-sans mt-3">
              This drill dynamically generates sentences that repeatedly test these exact words in rhythm.
            </p>
          </div>
        )}

        {drillType === 'biwords' && (
          <div className="bg-[#F7F7F7] dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-4 mb-5">
            <span className="text-xs font-bold text-[#111111] dark:text-white block mb-2">
              Challenging Biwords (Bigrams)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {topBiwords.length > 0 ? (
                topBiwords.map(([bg, count]) => (
                  <span key={bg} className="px-2.5 py-1 rounded-lg bg-[#FF6E1A]/10 border border-[#FF6E1A]/30 text-[#FF6E1A] text-xs font-bold">
                    "{bg}" ({count}×)
                  </span>
                ))
              ) : (
                ['th', 'er', 'on', 'an', 're', 'in', 'ed', 'st'].map(bg => (
                  <span key={bg} className="px-2.5 py-1 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] text-xs font-bold">
                    "{bg}" (core)
                  </span>
                ))
              )}
            </div>
            <p className="text-[11px] text-[#666666] dark:text-[#71717A] font-sans mt-3">
              Biword training isolates 2-letter finger transitions to build fluid keyboard agility.
            </p>
          </div>
        )}

        {drillType === 'custom' && (
          <div className="mb-5">
            <label className="text-xs font-bold text-[#111111] dark:text-white block mb-1.5">
              Enter Words to Drill (Space or Comma Separated)
            </label>
            <textarea
              rows={3}
              value={customWordsInput}
              onChange={e => setCustomWordsInput(e.target.value)}
              placeholder="e.g. algorithm, recursive, benchmark, asynchronous, polymorphic"
              className="w-full bg-white dark:bg-[#080808] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-3 text-xs text-[#111111] dark:text-white placeholder-[#888888] dark:placeholder-[#71717A] focus:outline-none focus:border-[#FF5A00] font-mono"
            />
          </div>
        )}

        {/* CTA Launch */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {topMissed.length > 0 && (
            <button
              onClick={handleClearWeaknesses}
              className="p-2 text-[#888888] dark:text-[#71717A] hover:text-[#FF3B5C] text-xs flex items-center gap-1 transition-colors"
              title="Clear Tracked Weaknesses"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Weaknesses</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleLaunch}
              className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-[#FF5A00] text-black hover:shadow-[0_0_16px_rgba(255,90,0,0.4)] flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Practice</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
