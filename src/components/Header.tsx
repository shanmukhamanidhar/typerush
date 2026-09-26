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
  SlidersHorizontal,
  Search,
  Coffee
} from 'lucide-react';
import { UserSettings, UserProfile } from '../types/typing';
import { TypeRushLogo } from './TypeRushLogo';

export type AppTab = 'test' | 'tester' | 'race' | 'daily' | 'history' | 'profile';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  settings: UserSettings;
  profile: UserProfile;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenCommandPalette?: () => void;
  onOpenPracticeModal?: () => void;
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
  onOpenCommandPalette,
  onOpenPracticeModal,
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
      <header className="w-full py-2 px-6 flex justify-between items-center bg-white/90 dark:bg-[#080808]/90 border-b border-[#E5E5E5] dark:border-[#222222] backdrop-blur-sm font-mono text-xs opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[#FF5A00] font-bold tracking-wider">[TYPERUSH FOCUS ACTIVE]</span>
        <button
          onClick={toggleFocusMode}
          className="px-2.5 py-1 rounded-md bg-[#F7F7F7] dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] text-[#6B6B6B] hover:text-[#111111] dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Exit Focus</span>
        </button>
      </header>
    );
  }

  return (
    <header className="w-full border-b border-[#E5E5E5] dark:border-[#222222] bg-white/95 dark:bg-[#080808]/95 backdrop-blur-md sticky top-0 z-40 transition-colors font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo & Wordmark */}
        <div 
          onClick={() => !isTestActive && onSelectTab('test')} 
          className="cursor-pointer group select-none shrink-0"
        >
          <TypeRushLogo variant="full" size="md" showProBadge={true} />
        </div>

        {/* Center: Main Primary Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => onSelectTab('test')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'test'
                ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/40 shadow-[0_0_12px_rgba(255,90,0,0.20)]'
                : 'text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#FF5A00]/5 border border-transparent'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Keyboard className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>TYPING</span>
          </button>

          <button
            onClick={() => onSelectTab('tester')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'tester'
                ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/40 shadow-[0_0_12px_rgba(255,90,0,0.20)]'
                : 'text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#FF5A00]/5 border border-transparent'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">KEYBOARD TESTER</span>
            <span className="xs:hidden">TESTER</span>
          </button>

          <button
            onClick={() => onSelectTab('race')}
            disabled={isTestActive}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'race'
                ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/40 shadow-[0_0_12px_rgba(255,90,0,0.20)]'
                : 'text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#FF5A00]/5 border border-transparent'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Radio className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span className="hidden sm:inline">MULTIPLAYER RACE</span>
            <span className="sm:hidden">MULTIPLAYER</span>
          </button>

          <button
            onClick={() => onSelectTab('daily')}
            disabled={isTestActive}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'daily'
                ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/40 shadow-[0_0_12px_rgba(255,90,0,0.20)]'
                : 'text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#FF5A00]/5 border border-transparent'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Flame className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>DAILY</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            disabled={isTestActive}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              currentTab === 'history'
                ? 'bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/40 shadow-[0_0_12px_rgba(255,90,0,0.20)]'
                : 'text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#FF5A00]/5 border border-transparent'
            } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HISTORY</span>
          </button>
        </nav>

        {/* Right: Command Palette, Quick Controls, Fullscreen, Profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#F7F7F7] dark:hover:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00]/40 text-xs transition-all"
              title="Command Palette (Ctrl+Shift+P or Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span className="hidden md:inline font-bold text-[11px]">CMD</span>
              <kbd className="hidden lg:inline text-[9px] px-1 rounded bg-[#E5E5E5] dark:bg-[#1A1A1A] text-[#6B6B6B] border border-[#D4D4D4] dark:border-[#2E2E2E]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Practice Lab Trigger */}
          {onOpenPracticeModal && (
            <button
              onClick={onOpenPracticeModal}
              className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#F7F7F7] dark:hover:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00]/40 transition-all hidden sm:block"
              title="Targeted Practice Lab"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Focus Mode Toggle */}
          <button
            onClick={toggleFocusMode}
            className={`p-1.5 rounded-lg border transition-all ${
              settings.focusMode 
                ? 'text-[#FF5A00] bg-[#FF5A00]/10 border-[#FF5A00]/40' 
                : 'text-[#6B6B6B] hover:text-[#FF5A00] bg-[#F7F7F7] dark:bg-[#111111] border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00]/40'
            }`}
            title={settings.focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          >
            {settings.focusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#F7F7F7] dark:hover:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00]/40 transition-all hidden sm:block"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#F7F7F7] dark:hover:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00]/40 transition-all"
            title="Toggle Dark / Light Theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FF5A00]" /> : <Moon className="w-3.5 h-3.5 text-[#FF5A00]" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#F7F7F7] dark:hover:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00]/40 transition-all"
            title="Preferences & Theme Settings"
          >
            <Settings className="w-3.5 h-3.5 hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#FF5A00] hover:bg-[#F7F7F7] dark:hover:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00]/40 transition-all hidden sm:block"
            title="Help & Shortcuts"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Profile Shortcut */}
          <button
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-lg border transition-all ${
              currentTab === 'profile'
                ? 'bg-[#FF5A00]/10 border-[#FF5A00]/50 text-[#FF5A00]'
                : 'bg-[#F7F7F7] dark:bg-[#111111] border-[#E5E5E5] dark:border-[#222222] text-[#6B6B6B] hover:text-[#FF5A00] hover:border-[#FF5A00]/40'
            }`}
            title="View Profile & Achievements"
          >
            <div className="w-5 h-5 rounded-md bg-[#FF5A00] text-black font-black text-[10px] flex items-center justify-center shadow-xs">
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
