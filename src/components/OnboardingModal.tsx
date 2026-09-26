import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X, Keyboard, Target, Trophy } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      badge: 'STEP 1 OF 3',
      title: 'Choose Your Battleground',
      desc: 'Select from Time Sprints (15s/30s/60s), Word Count Goals, Curated Quotes, Programming Code, or challenge friends in the Multiplayer Realtime Arena.',
      icon: <Target className="w-8 h-8 text-[#FF5A00]" />,
    },
    {
      step: 2,
      badge: 'STEP 2 OF 3',
      title: 'Precision Keystroke Engine',
      desc: 'Start typing into the highlighted passage. Track live WPM, accuracy, errors, and rhythm consistency with zero input latency.',
      icon: <Keyboard className="w-8 h-8 text-[#FF6E1A]" />,
    },
    {
      step: 3,
      badge: 'STEP 3 OF 3',
      title: 'Deep Analytics & Rankings',
      desc: 'Inspect your typing speed curve, keyboard heatmap, error frequency analysis, and unlock achievements as you climb the ranks.',
      icon: <Trophy className="w-8 h-8 text-[#FF6E1A]" />,
    },
  ];

  const current = steps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
        
        {/* Step Badge */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <span className="text-[10px] font-bold text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/20 px-2 py-0.5 rounded-full">
            {current.badge}
          </span>
          <button
            onClick={onComplete}
            className="text-xs text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white transition-colors"
          >
            SKIP
          </button>
        </div>

        {/* Icon & Details */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF5A00]/10 border border-[#FF5A00]/30 flex items-center justify-center mb-4 shadow-lg shadow-[#FF5A00]/10">
          {current.icon}
        </div>

        <h3 className="text-xl font-black text-[#111111] dark:text-white mb-2">
          {current.title}
        </h3>
        <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans leading-relaxed mb-8">
          {current.desc}
        </p>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                step === s ? 'w-6 bg-[#FF5A00]' : 'w-2 bg-[#E5E5E5] dark:bg-[#2A2A2A]'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-1/3 py-3 rounded-xl text-xs font-bold text-[#666666] dark:text-[#A1A1AA] bg-[#F7F7F7] dark:bg-[#1A1A1A] hover:text-[#111111] dark:hover:text-white"
            >
              BACK
            </button>
          )}

          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                onComplete();
              }
            }}
            className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#FF5A00] hover:brightness-110 shadow-md shadow-[#FF5A00]/25 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{step === 3 ? 'GET STARTED' : 'NEXT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
