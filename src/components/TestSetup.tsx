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
  Coffee,
  Hash,
  Globe,
  Sliders,
  AlertTriangle,
  Play,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  Difficulty, 
  DifficultyRule,
  Category, 
  TestMode, 
  CodeLanguage,
  QuoteLength,
  LanguageCode,
  WordSetSize
} from '../types/typing';

interface TestSetupProps {
  mode: TestMode;
  onSelectMode: (m: TestMode) => void;
  duration: number;
  onSelectDuration: (d: number) => void;
  wordCount: number;
  onSelectWordCount: (w: number) => void;
  quoteLength: QuoteLength;
  onSelectQuoteLength: (ql: QuoteLength) => void;
  difficulty: Difficulty;
  onSelectDifficulty: (d: Difficulty) => void;
  difficultyRule: DifficultyRule;
  onSelectDifficultyRule: (rule: DifficultyRule) => void;
  category: Category;
  onSelectCategory: (c: Category) => void;
  codeLanguage: CodeLanguage;
  onSelectCodeLanguage: (lang: CodeLanguage) => void;
  customText: string;
  onChangeCustomText: (text: string) => void;
  punctuation: boolean;
  onTogglePunctuation: () => void;
  numbers: boolean;
  onToggleNumbers: () => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  wordSet: WordSetSize;
  onSelectWordSet: (ws: WordSetSize) => void;
  onStartTest: () => void;
  onQuickTest: () => void;
  onOpenPracticeModal: () => void;
}

export const TestSetup: React.FC<TestSetupProps> = ({
  mode,
  onSelectMode,
  duration,
  onSelectDuration,
  wordCount,
  onSelectWordCount,
  quoteLength,
  onSelectQuoteLength,
  difficulty,
  onSelectDifficulty,
  difficultyRule,
  onSelectDifficultyRule,
  category,
  onSelectCategory,
  codeLanguage,
  onSelectCodeLanguage,
  customText,
  onChangeCustomText,
  punctuation,
  onTogglePunctuation,
  numbers,
  onToggleNumbers,
  language,
  onSelectLanguage,
  wordSet,
  onSelectWordSet,
  onStartTest,
  onQuickTest,
  onOpenPracticeModal,
}) => {
  const [customError, setCustomError] = useState<string | null>(null);
  const [isCustomDurationInput, setIsCustomDurationInput] = useState<boolean>(false);
  const [customDurationVal, setCustomDurationVal] = useState<string>(duration.toString());
  const [isCustomWordCountInput, setIsCustomWordCountInput] = useState<boolean>(false);
  const [customWordCountVal, setCustomWordCountVal] = useState<string>(wordCount.toString());

  const testModes: { id: TestMode; label: string; icon: React.ReactNode }[] = [
    { id: 'time', label: 'Time', icon: <Timer className="w-3.5 h-3.5" /> },
    { id: 'words', label: 'Words', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'custom', label: 'Custom', icon: <FileEdit className="w-3.5 h-3.5" /> },
    { id: 'zen', label: 'Zen', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'practice', label: 'Practice', icon: <Coffee className="w-3.5 h-3.5" /> },
  ];

  const durations = [
    { value: 15, label: '15s', desc: 'Sprint' },
    { value: 30, label: '30s', desc: 'Standard' },
    { value: 60, label: '60s', desc: 'Endurance' },
    { value: 120, label: '120s', desc: 'Extended' },
    { value: 180, label: '180s', desc: 'Marathon' },
  ];

  const wordCounts = [10, 25, 50, 100, 200, 500, 1000];

  const languagesList: { id: LanguageCode; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'en-gb', label: 'British' },
    { id: 'es', label: 'Spanish' },
    { id: 'fr', label: 'French' },
    { id: 'de', label: 'German' },
    { id: 'it', label: 'Italian' },
    { id: 'pt', label: 'Portuguese' },
    { id: 'nl', label: 'Dutch' },
    { id: 'ja-ro', label: 'Japanese Romaji' },
  ];

  const codeLanguages: { id: CodeLanguage; label: string }[] = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'rust', label: 'Rust' },
    { id: 'go', label: 'Go' },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'sql', label: 'SQL' },
  ];

  const quoteLengths: { id: QuoteLength; label: string; desc: string }[] = [
    { id: 'short', label: 'Short', desc: '< 80 chars' },
    { id: 'medium', label: 'Medium', desc: '80 - 180 chars' },
    { id: 'long', label: 'Long', desc: '> 180 chars' },
    { id: 'random', label: 'Random', desc: 'All lengths' },
  ];

  const difficultyRules: { id: DifficultyRule; label: string; badge: string; desc: string }[] = [
    { id: 'normal', label: 'Normal', badge: 'text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]', desc: 'Standard typing with real-time feedback' },
    { id: 'expert', label: 'Expert', badge: 'text-[#FF6E1A] bg-[#FF6E1A]/10 border border-[#FF6E1A]', desc: 'Submitting a mistyped word fails immediately' },
    { id: 'master', label: 'Master', badge: 'text-[#D95400] bg-[#D95400]/10 border border-[#D95400]', desc: 'Any single incorrect key immediately fails test' },
  ];

  const handleStartCustom = () => {
    const trimmed = customText.trim();
    if (trimmed.length < 10) {
      setCustomError('Custom passage must contain at least 10 characters.');
      return;
    }
    setCustomError(null);
    onStartTest();
  };

  const handleApplyCustomDuration = () => {
    const val = parseInt(customDurationVal, 10);
    if (!isNaN(val) && val >= 5 && val <= 3600) {
      onSelectDuration(val);
      setIsCustomDurationInput(false);
    }
  };

  const handleApplyCustomWordCount = () => {
    const val = parseInt(customWordCountVal, 10);
    if (!isNaN(val) && val >= 5 && val <= 5000) {
      onSelectWordCount(val);
      setIsCustomWordCountInput(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center py-4 px-4 animate-fadeIn font-mono">
      {/* Hero Headline */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/40 shadow-[0_0_12px_rgba(255,90,0,0.20)] mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#FF5A00]" />
        <span>Precision Typing Lab</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-[#111111] dark:text-[#F5F5F5] tracking-tight mb-2.5 font-sans">
        How fast can you <span className="text-[#FF5A00]">really type?</span>
      </h1>
      
      <p className="text-xs sm:text-sm text-[#6B6B6B] dark:text-[#A1A1AA] max-w-xl mb-6 leading-relaxed font-sans">
        Challenge your speed, accuracy and consistency. Configure custom word sets, punctuation, numbers, rules, and code across 9 languages.
      </p>

      {/* TOP PRIMARY CONFIGURATION BAR */}
      <div className="w-full flex flex-col items-center gap-4 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-5 sm:p-6 shadow-md dark:shadow-none mb-8">
        
        {/* ROW 1: PRIMARY TEST MODES */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#F7F7F7] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A]">
          {testModes.map((item) => {
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'practice') {
                    onOpenPracticeModal();
                  } else {
                    onSelectMode(item.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#FF5A00] text-black shadow-[0_0_16px_rgba(255,90,0,0.25)]'
                    : 'text-[#6B6B6B] hover:text-[#111111] dark:hover:text-[#F5F5F5] hover:bg-[#E5E5E5] dark:hover:bg-[#161616]'
                }`}
              >
                {item.icon}
                <span className="uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ROW 2: DYNAMIC SUB-CONFIGURATIONS BASED ON ACTIVE MODE */}
        
        {/* SUB-OPTIONS FOR TIME MODE */}
        {mode === 'time' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#6B6B6B] dark:text-[#A1A1AA] uppercase mr-1">Duration:</span>
            {durations.map((d) => (
              <button
                key={d.value}
                onClick={() => onSelectDuration(d.value)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  duration === d.value && !isCustomDurationInput
                    ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]'
                    : 'bg-[#F7F7F7] dark:bg-[#161616] text-[#6B6B6B] dark:text-[#A1A1AA] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}

            {isCustomDurationInput ? (
              <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#161616] px-2 py-0.5 rounded-lg border border-[#FF5A00]">
                <input
                  type="number"
                  min={5}
                  max={3600}
                  value={customDurationVal}
                  onChange={e => setCustomDurationVal(e.target.value)}
                  className="w-14 bg-transparent text-xs text-[#111111] dark:text-white focus:outline-none font-bold"
                  placeholder="sec"
                  autoFocus
                />
                <button
                  onClick={handleApplyCustomDuration}
                  className="text-[10px] font-bold text-[#FF5A00] hover:underline"
                >
                  SET
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCustomDurationInput(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  !durations.some(d => d.value === duration)
                    ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]'
                    : 'border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {!durations.some(d => d.value === duration) ? `${duration}s Custom` : 'Custom...'}
              </button>
            )}
          </div>
        )}

        {/* SUB-OPTIONS FOR WORDS MODE */}
        {mode === 'words' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#6B6B6B] dark:text-[#A1A1AA] uppercase mr-1">Words:</span>
            {wordCounts.map((wc) => (
              <button
                key={wc}
                onClick={() => onSelectWordCount(wc)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  wordCount === wc && !isCustomWordCountInput
                    ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]'
                    : 'bg-[#F7F7F7] dark:bg-[#161616] text-[#6B6B6B] dark:text-[#A1A1AA] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {wc}
              </button>
            ))}

            {isCustomWordCountInput ? (
              <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#161616] px-2 py-0.5 rounded-lg border border-[#FF5A00]">
                <input
                  type="number"
                  min={5}
                  max={5000}
                  value={customWordCountVal}
                  onChange={e => setCustomWordCountVal(e.target.value)}
                  className="w-14 bg-transparent text-xs text-[#111111] dark:text-white focus:outline-none font-bold"
                  placeholder="words"
                  autoFocus
                />
                <button
                  onClick={handleApplyCustomWordCount}
                  className="text-[10px] font-bold text-[#FF5A00] hover:underline"
                >
                  SET
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCustomWordCountInput(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  !wordCounts.includes(wordCount)
                    ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]'
                    : 'border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {!wordCounts.includes(wordCount) ? `${wordCount} Words` : 'Custom...'}
              </button>
            )}
          </div>
        )}

        {/* SUB-OPTIONS FOR QUOTE MODE */}
        {mode === 'quote' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#6B6B6B] dark:text-[#A1A1AA] uppercase mr-1">Length:</span>
            {quoteLengths.map((q) => (
              <button
                key={q.id}
                onClick={() => onSelectQuoteLength(q.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  quoteLength === q.id
                    ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]'
                    : 'bg-[#F7F7F7] dark:bg-[#161616] text-[#6B6B6B] dark:text-[#A1A1AA] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-[#111111] dark:hover:text-white'
                }`}
                title={q.desc}
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* SUB-OPTIONS FOR CODE MODE */}
        {mode === 'code' && (
          <div className="flex flex-wrap items-center justify-center gap-1 pt-1 max-w-2xl">
            <span className="text-[11px] font-bold text-[#6B6B6B] dark:text-[#A1A1AA] uppercase mr-1">Language:</span>
            {codeLanguages.map((cl) => (
              <button
                key={cl.id}
                onClick={() => onSelectCodeLanguage(cl.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  codeLanguage === cl.id
                    ? 'bg-[#FF5A00] text-black font-black shadow-xs'
                    : 'bg-[#F7F7F7] dark:bg-[#161616] text-[#6B6B6B] dark:text-[#A1A1AA] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {cl.label}
              </button>
            ))}
          </div>
        )}

        {/* SUB-OPTIONS FOR ZEN MODE */}
        {mode === 'zen' && (
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B] dark:text-[#A1A1AA] py-1 font-sans">
            <Sparkles className="w-4 h-4 text-[#FF5A00] shrink-0" />
            <span>Continuous flow typing. Words replenish seamlessly. End whenever ready to view stats.</span>
          </div>
        )}

        {/* ROW 3: MODIFIERS (Punctuation, Numbers, Language Dictionaries, Wordset, Difficulty Rule) */}
        {(mode === 'time' || mode === 'words' || mode === 'zen') && (
          <div className="w-full pt-3 mt-1 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* TOGGLES: Punctuation & Numbers */}
            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePunctuation}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all border ${
                  punctuation
                    ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00]'
                    : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#161616] text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Punctuation {punctuation ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={onToggleNumbers}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all border ${
                  numbers
                    ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00]'
                    : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#161616] text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <span>123</span>
                <span>Numbers {numbers ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* LANGUAGE & WORDSET SELECTORS */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#161616] px-2.5 py-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <Globe className="w-3.5 h-3.5 text-[#FF5A00] mr-1" />
                <select
                  value={language}
                  onChange={e => onSelectLanguage(e.target.value as LanguageCode)}
                  aria-label="Language Dictionary"
                  className="bg-transparent text-xs text-[#111111] dark:text-white focus:outline-none cursor-pointer font-bold"
                >
                  {languagesList.map(l => (
                    <option key={l.id} value={l.id} className="bg-white dark:bg-[#111111] text-[#111111] dark:text-white">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#161616] px-2.5 py-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] text-[#6B6B6B] dark:text-[#A1A1AA] uppercase mr-1">Pool:</span>
                <select
                  value={wordSet}
                  onChange={e => onSelectWordSet(e.target.value === 'extended' ? 'extended' : parseInt(e.target.value, 10) as WordSetSize)}
                  aria-label="Vocabulary Word Set Size"
                  className="bg-transparent text-xs text-[#111111] dark:text-white focus:outline-none cursor-pointer font-bold"
                >
                  <option value={200} className="bg-white dark:bg-[#111111] text-[#111111] dark:text-white">Top 200</option>
                  <option value={500} className="bg-white dark:bg-[#111111] text-[#111111] dark:text-white">Top 500</option>
                  <option value={1000} className="bg-white dark:bg-[#111111] text-[#111111] dark:text-white">Top 1000</option>
                  <option value="extended" className="bg-white dark:bg-[#111111] text-[#111111] dark:text-white">Extended</option>
                </select>
              </div>
            </div>

            {/* DIFFICULTY RULES (Normal, Expert, Master) */}
            <div className="flex items-center gap-1 bg-[#F7F7F7] dark:bg-[#161616] p-0.5 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A]">
              {difficultyRules.map(r => (
                <button
                  key={r.id}
                  onClick={() => onSelectDifficultyRule(r.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    difficultyRule === r.id
                      ? r.badge
                      : 'text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                  }`}
                  title={r.desc}
                >
                  {r.label}
                </button>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* CUSTOM TEXT INPUT AREA IF CUSTOM MODE */}
      {mode === 'custom' && (
        <div className="w-full max-w-3xl mb-6 text-left">
          <label className="text-xs font-bold text-[#6B6B6B] dark:text-[#A1A1AA] block mb-1.5">
            Enter or paste your custom passage:
          </label>
          <textarea
            rows={4}
            value={customText}
            onChange={e => onChangeCustomText(e.target.value)}
            placeholder="Paste your own text snippet or practice drill here..."
            className="w-full bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-4 text-xs font-mono text-[#111111] dark:text-white placeholder-[#6B6B6B] dark:placeholder-[#555555] focus:outline-none focus:border-[#FF5A00] shadow-xs"
          />
          {customError && (
            <p className="text-xs text-[#D95400] font-bold mt-1">{customError}</p>
          )}
        </div>
      )}

      {/* START TEST CTAS */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={mode === 'custom' ? handleStartCustom : onStartTest}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-[#FF5A00] text-black hover:bg-[#FF6E1A] shadow-[0_0_20px_rgba(255,90,0,0.30)] hover:shadow-[0_0_28px_rgba(255,90,0,0.45)] flex items-center justify-center gap-2 transform active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START TEST (ENTER)</span>
        </button>

        <button
          onClick={onQuickTest}
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#FF5A00] hover:text-black hover:bg-[#FF5A00] bg-transparent dark:bg-[#111111]/60 border border-[#FF5A00]/40 hover:border-[#FF5A00] flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 text-[#FF5A00] fill-current" />
          <span>Quick 15s Sprint</span>
        </button>

        <button
          onClick={onOpenPracticeModal}
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#FF5A00] hover:text-black hover:bg-[#FF5A00] bg-transparent dark:bg-[#111111]/60 border border-[#FF5A00]/40 hover:border-[#FF5A00] flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <Coffee className="w-3.5 h-3.5 text-[#FF5A00]" />
          <span>Target Weaknesses</span>
        </button>
      </div>

    </div>
  );
};
