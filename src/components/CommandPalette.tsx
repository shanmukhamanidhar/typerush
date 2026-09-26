import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Terminal, 
  Clock, 
  Target, 
  Quote, 
  Code, 
  Sparkles, 
  Coffee, 
  Flame, 
  Palette, 
  Keyboard, 
  Eye, 
  ShieldAlert, 
  Hash, 
  Layers, 
  Sliders, 
  RefreshCw,
  X
} from 'lucide-react';
import { 
  TestMode, 
  LanguageCode, 
  ThemeId, 
  KeymapLayout, 
  DifficultyRule 
} from '../types/typing';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Mode' | 'Language' | 'Theme' | 'Sound' | 'Input & HUD' | 'Navigation' | 'Action';
  icon: React.ReactNode;
  shortcut?: string;
  handler: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: TestMode, duration?: number, wordCount?: number) => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onSelectTheme: (theme: ThemeId) => void;
  onToggleSound?: () => void;
  onSelectSoundPack?: (pack?: any) => void;
  onTogglePunctuation: () => void;
  onToggleNumbers: () => void;
  onToggleBlindMode: () => void;
  onToggleConfidenceMode: () => void;
  onSelectKeymap: (layout: KeymapLayout) => void;
  onSelectDifficultyRule: (rule: DifficultyRule) => void;
  onNavigateTab: (tab: string) => void;
  onRestartTest: () => void;
  onOpenSettings: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onSelectLanguage,
  onSelectTheme,
  onToggleSound,
  onSelectSoundPack,
  onTogglePunctuation,
  onToggleNumbers,
  onToggleBlindMode,
  onToggleConfidenceMode,
  onSelectKeymap,
  onSelectDifficultyRule,
  onNavigateTab,
  onRestartTest,
  onOpenSettings,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allCommands: CommandItem[] = useMemo(() => [
    // ACTIONS & QUICK TESTS
    {
      id: 'act-restart',
      title: 'Restart Current Test',
      category: 'Action',
      icon: <RefreshCw className="w-4 h-4 text-[#FF5A00]" />,
      shortcut: 'Tab+Enter',
      handler: () => { onRestartTest(); onClose(); }
    },
    {
      id: 'act-quick-15',
      title: 'Quick 15s Sprint',
      category: 'Action',
      icon: <Clock className="w-4 h-4 text-[#FF6E1A]" />,
      handler: () => { onSelectMode('time', 15); onClose(); }
    },

    // TEST MODES
    {
      id: 'mode-time-15',
      title: 'Mode: Time 15s',
      category: 'Mode',
      icon: <Clock className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectMode('time', 15); onClose(); }
    },
    {
      id: 'mode-time-30',
      title: 'Mode: Time 30s (Standard)',
      category: 'Mode',
      icon: <Clock className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectMode('time', 30); onClose(); }
    },
    {
      id: 'mode-time-60',
      title: 'Mode: Time 60s (Endurance)',
      category: 'Mode',
      icon: <Clock className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectMode('time', 60); onClose(); }
    },
    {
      id: 'mode-words-25',
      title: 'Mode: Words 25',
      category: 'Mode',
      icon: <Target className="w-4 h-4 text-[#FF6E1A]" />,
      handler: () => { onSelectMode('words', undefined, 25); onClose(); }
    },
    {
      id: 'mode-words-50',
      title: 'Mode: Words 50',
      category: 'Mode',
      icon: <Target className="w-4 h-4 text-[#FF6E1A]" />,
      handler: () => { onSelectMode('words', undefined, 50); onClose(); }
    },
    {
      id: 'mode-words-100',
      title: 'Mode: Words 100',
      category: 'Mode',
      icon: <Target className="w-4 h-4 text-[#FF6E1A]" />,
      handler: () => { onSelectMode('words', undefined, 100); onClose(); }
    },
    {
      id: 'mode-quote',
      title: 'Mode: Quotes & Authors',
      category: 'Mode',
      icon: <Quote className="w-4 h-4 text-[#FFA347]" />,
      handler: () => { onSelectMode('quote'); onClose(); }
    },
    {
      id: 'mode-code',
      title: 'Mode: Developer Code Snippets',
      category: 'Mode',
      icon: <Code className="w-4 h-4 text-[#FF6E1A]" />,
      handler: () => { onSelectMode('code'); onClose(); }
    },
    {
      id: 'mode-zen',
      title: 'Mode: Zen Mode (Continuous Typing)',
      category: 'Mode',
      icon: <Sparkles className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectMode('zen'); onClose(); }
    },
    {
      id: 'mode-practice',
      title: 'Mode: Practice Weaknesses',
      category: 'Mode',
      icon: <Coffee className="w-4 h-4 text-[#FFA347]" />,
      handler: () => { onSelectMode('practice'); onClose(); }
    },
    {
      id: 'mode-daily',
      title: 'Mode: Daily Challenge',
      category: 'Mode',
      icon: <Flame className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onNavigateTab('daily'); onClose(); }
    },

    // INPUT RULES & HUD
    {
      id: 'rule-punct',
      title: 'Toggle Punctuation (.,?!"-)',
      category: 'Input & HUD',
      icon: <Hash className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onTogglePunctuation(); onClose(); }
    },
    {
      id: 'rule-numbers',
      title: 'Toggle Numbers (123...)',
      category: 'Input & HUD',
      icon: <Hash className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onToggleNumbers(); onClose(); }
    },
    {
      id: 'rule-confidence',
      title: 'Toggle Confidence Mode (No Backspace)',
      category: 'Input & HUD',
      icon: <ShieldAlert className="w-4 h-4 text-[#FFA347]" />,
      handler: () => { onToggleConfidenceMode(); onClose(); }
    },
    {
      id: 'rule-blind',
      title: 'Toggle Blind Mode (Hide Live Feedback)',
      category: 'Input & HUD',
      icon: <Eye className="w-4 h-4 text-[#FF6E1A]" />,
      handler: () => { onToggleBlindMode(); onClose(); }
    },
    {
      id: 'diff-normal',
      title: 'Difficulty Rule: Normal',
      category: 'Input & HUD',
      icon: <Sliders className="w-4 h-4 text-[#FF8A00]" />,
      handler: () => { onSelectDifficultyRule('normal'); onClose(); }
    },
    {
      id: 'diff-expert',
      title: 'Difficulty Rule: Expert (Fail on mistyped word)',
      category: 'Input & HUD',
      icon: <Sliders className="w-4 h-4 text-amber-400" />,
      handler: () => { onSelectDifficultyRule('expert'); onClose(); }
    },
    {
      id: 'diff-master',
      title: 'Difficulty Rule: Master (Fail on any key error)',
      category: 'Input & HUD',
      icon: <Sliders className="w-4 h-4 text-rose-400" />,
      handler: () => { onSelectDifficultyRule('master'); onClose(); }
    },

    // LANGUAGES
    {
      id: 'lang-en',
      title: 'Language: English',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('en'); onClose(); }
    },
    {
      id: 'lang-en-gb',
      title: 'Language: British English',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('en-gb'); onClose(); }
    },
    {
      id: 'lang-es',
      title: 'Language: Spanish (Español)',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('es'); onClose(); }
    },
    {
      id: 'lang-fr',
      title: 'Language: French (Français)',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('fr'); onClose(); }
    },
    {
      id: 'lang-de',
      title: 'Language: German (Deutsch)',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('de'); onClose(); }
    },
    {
      id: 'lang-it',
      title: 'Language: Italian (Italiano)',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('it'); onClose(); }
    },
    {
      id: 'lang-pt',
      title: 'Language: Portuguese (Português)',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('pt'); onClose(); }
    },
    {
      id: 'lang-nl',
      title: 'Language: Dutch (Nederlands)',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('nl'); onClose(); }
    },
    {
      id: 'lang-ja-ro',
      title: 'Language: Japanese Romaji',
      category: 'Language',
      icon: <Terminal className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectLanguage('ja-ro'); onClose(); }
    },

    // THEMES
    {
      id: 'theme-graphite',
      title: 'Theme: Precision Orange (Official)',
      category: 'Theme',
      icon: <Palette className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectTheme('graphite-cyan'); onClose(); }
    },
    {
      id: 'theme-obsidian',
      title: 'Theme: Obsidian Stealth',
      category: 'Theme',
      icon: <Palette className="w-4 h-4 text-neutral-400" />,
      handler: () => { onSelectTheme('obsidian'); onClose(); }
    },
    {
      id: 'theme-cyberpunk',
      title: 'Theme: Cyberpunk Sunset',
      category: 'Theme',
      icon: <Palette className="w-4 h-4 text-[#FF6E1A]" />,
      handler: () => { onSelectTheme('cyberpunk'); onClose(); }
    },
    {
      id: 'theme-terminal',
      title: 'Theme: Terminal Amber Orange',
      category: 'Theme',
      icon: <Palette className="w-4 h-4 text-[#FF8A00]" />,
      handler: () => { onSelectTheme('terminal80'); onClose(); }
    },
    {
      id: 'theme-solar',
      title: 'Theme: Solar Flare',
      category: 'Theme',
      icon: <Palette className="w-4 h-4 text-[#FFA347]" />,
      handler: () => { onSelectTheme('solarflare'); onClose(); }
    },
    {
      id: 'theme-arctic',
      title: 'Theme: Arctic Frost',
      category: 'Theme',
      icon: <Palette className="w-4 h-4 text-neutral-300" />,
      handler: () => { onSelectTheme('arctic'); onClose(); }
    },
    {
      id: 'theme-paper',
      title: 'Theme: Paper Light',
      category: 'Theme',
      icon: <Palette className="w-4 h-4 text-neutral-600" />,
      handler: () => { onSelectTheme('paper-light'); onClose(); }
    },

    // KEYBOARD LAYOUTS
    {
      id: 'layout-qwerty',
      title: 'Keymap: QWERTY',
      category: 'Input & HUD',
      icon: <Keyboard className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectKeymap('qwerty'); onClose(); }
    },
    {
      id: 'layout-dvorak',
      title: 'Keymap: Dvorak',
      category: 'Input & HUD',
      icon: <Keyboard className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectKeymap('dvorak'); onClose(); }
    },
    {
      id: 'layout-colemak',
      title: 'Keymap: Colemak',
      category: 'Input & HUD',
      icon: <Keyboard className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onSelectKeymap('colemak'); onClose(); }
    },

    // NAVIGATION
    {
      id: 'nav-tester',
      title: 'Open Keyboard Hardware Tester',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onNavigateTab('tester'); onClose(); }
    },
    {
      id: 'nav-race',
      title: 'Open Multiplayer Race',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onNavigateTab('race'); onClose(); }
    },
    {
      id: 'nav-history',
      title: 'View History & Performance Graphs',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onNavigateTab('history'); onClose(); }
    },
    {
      id: 'nav-profile',
      title: 'View Profile & Personal Bests',
      category: 'Navigation',
      icon: <Layers className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onNavigateTab('profile'); onClose(); }
    },
    {
      id: 'nav-settings',
      title: 'Open Preferences & Settings',
      category: 'Navigation',
      icon: <Sliders className="w-4 h-4 text-[#FF5A00]" />,
      handler: () => { onOpenSettings(); onClose(); }
    },
  ], [
    onRestartTest,
    onSelectMode,
    onTogglePunctuation,
    onToggleNumbers,
    onToggleConfidenceMode,
    onToggleBlindMode,
    onSelectDifficultyRule,
    onSelectLanguage,
    onSelectTheme,
    onToggleSound,
    onSelectSoundPack,
    onSelectKeymap,
    onNavigateTab,
    onOpenSettings,
    onClose,
  ]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const lower = query.toLowerCase();
    return allCommands.filter(c => 
      c.title.toLowerCase().includes(lower) || 
      c.category.toLowerCase().includes(lower)
    );
  }, [allCommands, query]);

  // Handle keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].handler();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#111111] border border-[#D8D6D1] dark:border-[#242424] rounded shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808]">
          <Search className="w-5 h-5 text-[#FF5A00] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, mode, theme, or language... (e.g. 'zen', 'theme', 'words')"
            className="w-full bg-transparent text-sm text-[#111111] dark:text-white placeholder-[#888888] dark:placeholder-[#71717A] focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#D8D6D1] dark:hover:bg-[#1A1A1A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#888888] dark:text-[#71717A]">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.handler()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded cursor-pointer text-xs transition-colors ${
                    isSelected 
                      ? 'bg-[#FF5A00] text-black font-bold shadow-[0_0_12px_rgba(255,90,0,0.25)]' 
                      : 'text-[#666666] dark:text-[#A1A1AA] hover:bg-[#F7F7F7] dark:hover:bg-[#1A1A1A] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-black' : ''}>
                      {cmd.icon}
                    </span>
                    <span className={isSelected ? 'text-black' : 'text-[#111111] dark:text-white font-medium'}>{cmd.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      isSelected 
                        ? 'bg-black/20 text-black' 
                        : 'bg-[#D8D6D1] dark:bg-[#1A1A1A] text-[#666666] dark:text-[#71717A]'
                    }`}>
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        isSelected 
                          ? 'border-black/30 text-black' 
                          : 'border-[#D8D6D1] dark:border-[#242424] text-[#666666] dark:text-[#71717A]'
                      }`}>
                        {cmd.shortcut}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#F7F7F7] dark:bg-[#080808] border-t border-[#D8D6D1] dark:border-[#242424] flex items-center justify-between text-[11px] text-[#666666] dark:text-[#71717A]">
          <span>Navigation: <kbd className="px-1.5 py-0.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-white dark:bg-[#111111] text-[#111111] dark:text-white font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-white dark:bg-[#111111] text-[#111111] dark:text-white font-mono text-[10px]">↓</kbd></span>
          <span>Execute: <kbd className="px-1.5 py-0.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-white dark:bg-[#111111] text-[#111111] dark:text-white font-mono text-[10px]">Enter</kbd></span>
          <span>Close: <kbd className="px-1.5 py-0.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-white dark:bg-[#111111] text-[#111111] dark:text-white font-mono text-[10px]">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
};
