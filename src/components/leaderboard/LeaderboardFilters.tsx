import React from 'react';

interface LeaderboardFiltersProps {
  timeframe: 'all-time' | 'weekly' | 'daily';
  testType: string;
  language: string;
  onSelectTimeframe: (tf: 'all-time' | 'weekly' | 'daily') => void;
  onSelectTestType: (tt: string) => void;
  onSelectLanguage: (lang: string) => void;
}

export const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  timeframe,
  testType,
  language,
  onSelectTimeframe,
  onSelectTestType,
  onSelectLanguage,
}) => {
  const timeframes: { id: 'all-time' | 'weekly' | 'daily'; label: string }[] = [
    { id: 'all-time', label: 'All-time' },
    { id: 'weekly', label: 'Weekly XP' },
    { id: 'daily', label: 'Daily' },
  ];

  const testTypes: { id: string; label: string }[] = [
    { id: 'time_15', label: 'Time 15' },
    { id: 'time_60', label: 'Time 60' },
    { id: 'words_25', label: 'Words 25' },
    { id: 'words_50', label: 'Words 50' },
    { id: 'quote', label: 'Quote' },
  ];

  const languages: { id: string; label: string }[] = [
    { id: 'english', label: 'English' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'all', label: 'All' },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#222222] font-mono text-xs overflow-x-auto no-scrollbar">
      
      {/* Timeframe Filter */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-[#646669] uppercase tracking-wider mr-1">Time:</span>
        <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] p-1 rounded-md">
          {timeframes.map(tf => (
            <button
              key={tf.id}
              onClick={() => onSelectTimeframe(tf.id)}
              className={`min-h-[34px] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center justify-center ${
                timeframe === tf.id
                  ? 'bg-black/10 dark:bg-white/10 text-[#FF5A00] font-bold'
                  : 'text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test Type Filter */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-[#646669] uppercase tracking-wider mr-1">Mode:</span>
        <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] p-1 rounded-md">
          {testTypes.map(tt => (
            <button
              key={tt.id}
              onClick={() => onSelectTestType(tt.id)}
              className={`min-h-[34px] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center justify-center ${
                testType === tt.id
                  ? 'bg-black/10 dark:bg-white/10 text-[#FF5A00] font-bold'
                  : 'text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
              }`}
            >
              {tt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-[#646669] uppercase tracking-wider mr-1">Lang:</span>
        <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] p-1 rounded-md">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => onSelectLanguage(lang.id)}
              className={`min-h-[34px] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center justify-center ${
                language === lang.id
                  ? 'bg-black/10 dark:bg-white/10 text-[#FF5A00] font-bold'
                  : 'text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
