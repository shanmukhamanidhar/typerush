import React, { useState } from 'react';
import { Target, Layers, Zap, Code, Play } from 'lucide-react';
import { 
  getStoredWeaknesses, 
  generateMissedWordsDrill, 
  generateBiwordDrill 
} from '../data/practiceEngine';

interface PracticeViewProps {
  onStartDrill: (passage: string, title: string) => void;
  onCancel: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  onStartDrill,
  onCancel,
}) => {
  const [selectedDrill, setSelectedDrill] = useState<'missed' | 'biwords' | 'numbers' | 'symbols'>('missed');
  const weaknesses = getStoredWeaknesses();

  const topMissed = Object.entries(weaknesses.missedWords || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const topBigrams = Object.entries(weaknesses.missedBigrams || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const handleLaunch = () => {
    if (selectedDrill === 'missed') {
      const drill = generateMissedWordsDrill();
      onStartDrill(drill.passage, 'Missed Words Targeted Drill');
    } else if (selectedDrill === 'biwords') {
      const drill = generateBiwordDrill();
      onStartDrill(drill.passage, 'Biwords Precision Drill');
    } else if (selectedDrill === 'numbers') {
      const numDrill = '104 928 381 7420 59 184 729 403 819 284 951 382 710 492 830 195 482 739 105 829';
      onStartDrill(numDrill, 'Number Row Velocity Drill');
    } else if (selectedDrill === 'symbols') {
      const symbolDrill = 'const data = [1, 2, 3]; if (x && y) { return (a > b) ? { valid: true } : false; }';
      onStartDrill(symbolDrill, 'Programming Syntax Drill');
    }
  };

  const drills: { id: 'missed' | 'biwords' | 'numbers' | 'symbols'; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'missed',
      title: 'missed words',
      desc: 'dynamically generates passages composed of terms where you previously registered miskeys.',
      icon: <Target className="w-4 h-4 text-[#FF5A00]" />,
    },
    {
      id: 'biwords',
      title: 'biwords & bigrams',
      desc: 'trains keystroke transition speed across difficult two-letter combinations like th, qu, st.',
      icon: <Layers className="w-4 h-4 text-[#FF5A00]" />,
    },
    {
      id: 'numbers',
      title: 'numbers row',
      desc: 'builds muscle memory for top-row numbers without having to look down.',
      icon: <Zap className="w-4 h-4 text-[#FF5A00]" />,
    },
    {
      id: 'symbols',
      title: 'code & syntax',
      desc: 'practice parentheses, brackets, operators, and boolean conditions common in programming.',
      icon: <Code className="w-4 h-4 text-[#FF5A00]" />,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 select-none font-mono animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#D8D6D1] dark:border-[#242424]">
        <h1 className="text-xl font-bold text-[#111111] dark:text-[#F5F5F5]">
          drills
        </h1>
        <button
          onClick={onCancel}
          className="text-xs text-[#FF5A00] hover:underline cursor-pointer"
        >
          return to test
        </button>
      </div>

      {/* Drill Selection */}
      <div className="space-y-4 mb-8">
        {drills.map((d) => {
          const isSelected = selectedDrill === d.id;
          return (
            <div
              key={d.id}
              onClick={() => setSelectedDrill(d.id)}
              className={`p-4 rounded transition-all cursor-pointer border ${
                isSelected
                  ? 'border-[#FF5A00] bg-[#FF5A00]/5'
                  : 'border-[#D8D6D1] dark:border-[#242424] hover:border-[#FF5A00]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${isSelected ? 'text-[#FF5A00]' : 'text-[#111111] dark:text-[#F5F5F5]'}`}>
                  {d.title}
                </span>
                {d.icon}
              </div>
              <p className="text-xs text-[#646669] dark:text-[#646669]">
                {d.desc}
              </p>
              {d.id === 'missed' && topMissed.length > 0 && isSelected && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[#D8D6D1]/40 dark:border-[#242424]/40">
                  {topMissed.map(([word, count]) => (
                    <span key={word} className="px-2 py-0.5 rounded text-[10px] bg-black/5 dark:bg-white/5 text-[#FF5A00]">
                      {word} ({count})
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Launch Action */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleLaunch}
          className="px-6 py-2 rounded bg-[#FF5A00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#FF6E1A] transition-all cursor-pointer"
        >
          start drill
        </button>
      </div>

    </div>
  );
};
