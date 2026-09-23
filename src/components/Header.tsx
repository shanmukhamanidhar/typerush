import React from 'react';
import { 
  Zap, 
  Sun, 
  Moon, 
  Settings, 
  History, 
  Info, 
  Keyboard, 
  Flame, 
  Trophy, 
  User, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { UserSettings, UserProfile } from '../types/typing';

export type AppTab = 'test' | 'tester' | 'race' | 'daily' | 'history' | 'profile';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  settings: UserSettings;
  profile: UserProfile;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  isTestActive: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  settings,
  profile,
  onUpdateSettings,
  onOpenSettings,
  onOpenHelp,
  isTestActive,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  const toggleFocusMode = () => {
    onUpdateSettings({ focusMode: !settings.focusMode });
  };

  // If focus mode is active during a test, render minimal header
  if (settings.focusMode && isTestActive) {
    return (
      <header className="w-full py-2 px-6 flex justify-between items-center bg-transparent backdrop-blur-xs font-mono text-xs opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-cyan-400 font-bold">TYPERUSH FOCUS ACTIVE</span>
        <button
          onClick={toggleFocusMode}
          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Exit Focus</span>
        </button>
      </header>
    );
  }

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-40 transition-colors font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo & Wordmark */}
        <div 
          onClick={() => !isTestActive && onSelectTab('test')} 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <Zap className="w-4 h-4 text-slate-950 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider text-slate-900 dark:text-white font-mono">
                TYPE<span className="text-cyan-500">RUSH</span>
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden lg:block tracking-tight font-sans">
              Type faster. Think sharper.
            </p>
          </div>
        </div>

        {/* Center: Main Primary Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => onSelectTab('test')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'test'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>TYPING</span>
          </button>

          <button
            onClick={() => onSelectTab('tester')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'tester'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">KEYBOARD TESTER</span>
            <span className="xs:hidden">TESTER</span>
          </button>

          <button
            onClick={() => onSelectTab('race')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'race'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>1V1 RACE</span>
          </button>

          <button
            onClick={() => onSelectTab('daily')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'daily'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>DAILY</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'history'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HISTORY</span>
          </button>
        </nav>

        {/* Right: Quick Controls, Fullscreen, Profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Focus Mode Toggle */}
          <button
            onClick={toggleFocusMode}
            className={`p-2 rounded-xl transition-all ${
              settings.focusMode ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={settings.focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          >
            {settings.focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all hidden sm:block"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Toggle Dark / Light Theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Preferences & Supabase Settings"
          >
            <Settings className="w-4 h-4 hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all hidden sm:block"
            title="Help & Shortcuts"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Profile Shortcut */}
          <button
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-xl border transition-all ${
              currentTab === 'profile'
                ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="View Profile & Achievements"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {profile.displayName.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-xs font-bold hidden md:inline truncate max-w-[80px]">
              {profile.displayName}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
