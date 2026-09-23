import React, { useState } from 'react';
import { 
  Timer, 
  Zap, 
  Gauge, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  FlaskConical, 
  Terminal, 
  Shuffle, 
  Quote, 
  Code, 
  FileEdit, 
  Target,
  Coffee
} from 'lucide-react';
import { 
  TestDuration, 
  WordCountOption, 
  Difficulty, 
  Category, 
  TestMode, 
  CodeLanguage 
} from '../types/typing';

interface TestSetupProps {
  mode: TestMode;
  onSelectMode: (m: TestMode) => void;
  duration: TestDuration;
  onSelectDuration: (d: TestDuration) => void;
  wordCount: WordCountOption;
  onSelectWordCount: (w: WordCountOption) => void;
  difficulty: Difficulty;
  onSelectDifficulty: (d: Difficulty) => void;
  category: Category;
  onSelectCategory: (c: Category) => void;
  codeLanguage: CodeLanguage;
  onSelectCodeLanguage: (lang: CodeLanguage) => void;
  customText: string;
  onChangeCustomText: (text: string) => void;
  onStartTest: () => void;
  onQuickTest: () => void;
}

export const TestSetup: React.FC<TestSetupProps> = ({
  mode,
  onSelectMode,
  duration,
  onSelectDuration,
  wordCount,
  onSelectWordCount,
  difficulty,
  onSelectDifficulty,
  category,
  onSelectCategory,
  codeLanguage,
  onSelectCodeLanguage,
  customText,
  onChangeCustomText,
  onStartTest,
  onQuickTest,
}) => {
  const [customError, setCustomError] = useState<string | null>(null);

  const testModes: { id: TestMode; label: string; icon: React.ReactNode }[] = [
    { id: 'time', label: 'Time', icon: <Timer className="w-3.5 h-3.5" /> },
    { id: 'words', label: 'Words', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'custom', label: 'Custom', icon: <FileEdit className="w-3.5 h-3.5" /> },
    { id: 'practice', label: 'Practice', icon: <Coffee className="w-3.5 h-3.5" /> },
  ];

  const durations: { value: TestDuration; label: string; desc: string }[] = [
    { value: 15, label: '15s', desc: 'Sprint' },
    { value: 30, label: '30s', desc: 'Standard' },
    { value: 60, label: '60s', desc: 'Endurance' },
  ];

  const wordCounts: { value: WordCountOption; label: string }[] = [
    { value: 10, label: '10 Words' },
    { value: 25, label: '25 Words' },
    { value: 50, label: '50 Words' },
    { value: 100, label: '100 Words' },
  ];

  const languages: { id: CodeLanguage; label: string }[] = [
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'java', label: 'Java' },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'sql', label: 'SQL' },
  ];

  const difficulties: { value: Difficulty; label: string; desc: string; badge: string }[] = [
    { value: 'easy', label: 'Easy', desc: 'Common words & simple sentences', badge: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { value: 'medium', label: 'Medium', desc: 'Standard varied vocabulary', badge: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
    { value: 'hard', label: 'Hard', desc: 'Technical terms & punctuation', badge: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  ];

  const categories: { value: Category; label: string; icon: React.ReactNode }[] = [
    { value: 'general', label: 'General', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { value: 'technology', label: 'Technology', icon: <Cpu className="w-3.5 h-3.5" /> },
    { value: 'science', label: 'Science', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { value: 'programming', label: 'Programming', icon: <Terminal className="w-3.5 h-3.5" /> },
    { value: 'random', label: 'Random', icon: <Shuffle className="w-3.5 h-3.5" /> },
  ];

  const handleStartCustom = () => {
    const trimmed = customText.trim();
    if (trimmed.length < 15) {
      setCustomError('Custom passage must contain at least 15 characters.');
      return;
    }
    if (trimmed.length > 1200) {
      setCustomError('Custom passage exceeds maximum length of 1200 characters.');
      return;
    }
    setCustomError(null);
    onStartTest();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center py-6 px-4 animate-fadeIn">
      {/* Hero Headline */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Precision Typing Lab</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-sans">
        How fast can you <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600">really type?</span>
      </h1>
      
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mb-6 leading-relaxed">
        Challenge your speed, accuracy and consistency. Choose between time sprints, word goals, curated quotes, developer code, or free practice.
      </p>

      {/* TOP PRIMARY MODE SELECTOR BAR */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg mb-6 font-mono">
        {testModes.map((item) => {
          const isSelected = mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span className="uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Mode Settings Matrix */}
      <div className="w-full bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/40 backdrop-blur-md mb-8 transition-colors text-left font-mono">
        
        {/* TIME MODE OPTIONS */}
        {mode === 'time' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-500" />
                Duration (Seconds)
              </span>
              <span className="text-xs text-slate-500">{duration} Seconds Selected</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {durations.map((item) => {
                const isSelected = duration === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => onSelectDuration(item.value)}
                    className={`p-3 sm:p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xl font-bold">{item.label}</div>
                    <div className="text-[11px] font-sans text-slate-500 uppercase">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* WORDS MODE OPTIONS */}
        {mode === 'words' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-500" />
                Target Word Count
              </span>
              <span className="text-xs text-slate-500">{wordCount} Words Goal</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {wordCounts.map((item) => {
                const isSelected = wordCount === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => onSelectWordCount(item.value)}
                    className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CODE MODE OPTIONS */}
        {mode === 'code' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-cyan-500" />
                Programming Language
              </span>
              <span className="text-xs text-slate-500 uppercase">{codeLanguage}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {languages.map((lang) => {
                const isSelected = codeLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => onSelectCodeLanguage(lang.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-sm ring-1 ring-cyan-500/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CUSTOM PASSAGE INPUT */}
        {mode === 'custom' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-cyan-500" />
                Paste or Type Custom Passage
              </span>
              <span className="text-xs text-slate-500">{customText.length} / 1200 characters</span>
            </div>

            <textarea
              value={customText}
              onChange={(e) => {
                onChangeCustomText(e.target.value);
                if (customError) setCustomError(null);
              }}
              rows={4}
              placeholder="Paste or type your custom text here. (Pasting is permitted here in setup, but prohibited during the live test)."
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-sans focus:outline-none focus:border-cyan-500"
            />

            {customError && (
              <div className="text-xs text-rose-500 font-sans mt-2">
                {customError}
              </div>
            )}
          </div>
        )}

        {/* PRACTICE MODE NOTICE */}
        {mode === 'practice' && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs font-sans text-slate-400 leading-relaxed">
            <strong className="text-cyan-400 font-mono block mb-1">UNTIMED PRACTICE MODE:</strong>
            Practice freely at your own pace without timer constraints. Net WPM and Accuracy will calculate continuously while you type.
          </div>
        )}

        {/* DIFFICULTY SELECTOR (Visible for time, words, practice) */}
        {(mode === 'time' || mode === 'words' || mode === 'practice') && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-500" />
                Difficulty Level
              </span>
              <span className="text-xs text-slate-500 uppercase">{difficulty}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {difficulties.map((item) => {
                const isSelected = difficulty === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => onSelectDifficulty(item.value)}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 ring-1 ring-cyan-500/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-sans">{item.label}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${item.badge}`}>
                        {item.value}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-sans mt-1 line-clamp-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CATEGORY SELECTOR (For time, words, practice) */}
        {(mode === 'time' || mode === 'words' || mode === 'practice') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-500" />
                Topic Category
              </span>
              <span className="text-xs text-slate-500 uppercase">{category}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const isSelected = category === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => onSelectCategory(item.value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <button
          onClick={mode === 'custom' ? handleStartCustom : onStartTest}
          className="w-full sm:w-2/3 py-4 px-6 rounded-2xl font-bold font-sans text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>START {mode.toUpperCase()} TEST</span>
        </button>

        <button
          onClick={onQuickTest}
          className="w-full sm:w-1/3 py-4 px-5 rounded-2xl font-semibold font-sans text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
          title="Instant 15-second sprint test"
        >
          <span>Quick 15s</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-4 font-mono">
        💡 Pro-Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-cyan-500">Enter</kbd> to launch immediately.
      </p>
    </div>
  );
};
