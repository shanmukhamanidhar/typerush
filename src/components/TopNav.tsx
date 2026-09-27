import React, { useState, useRef, useEffect } from 'react';
import { 
  Keyboard, 
  Users,
  Trophy, 
  BarChart3, 
  Info,
  Target, 
  FileText, 
  CheckSquare, 
  Sun, 
  Moon, 
  Settings, 
  Command, 
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { UserSettings, UserProfile } from '../types/typing';
import { UserProfileData } from '../services/authService';
import { TypeRushLogo } from './TypeRushLogo';

export type NavTab = 'home' | 'timetrial' | 'practice' | 'custom' | 'stats' | 'leaderboard' | 'leaderboards' | 'about' | 'settings' | 'tester' | 'multiplayer';

interface TopNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  settings: UserSettings;
  profile: UserProfile;
  currentUser?: User | null;
  currentProfile?: UserProfileData | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  isTestActive: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onSelectTab,
  settings,
  currentUser,
  currentProfile,
  onOpenAuthModal,
  onSignOut,
  onUpdateSettings,
  onOpenSettings,
  onOpenCommandPalette,
  isTestActive,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleTheme = () => {
    onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  // Close menus on tab change or navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [currentTab]);

  // Close account menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const centerNavItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'start test', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'multiplayer', label: 'multiplayer', icon: <Users className="w-4 h-4" /> },
    { id: 'leaderboards', label: 'leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'stats', label: 'stats', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'about', label: 'about', icon: <Info className="w-4 h-4" /> },
    { id: 'practice', label: 'drills', icon: <Target className="w-4 h-4" /> },
    { id: 'custom', label: 'custom text', icon: <FileText className="w-4 h-4" /> },
    { id: 'tester', label: 'key tester', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="relative w-full flex items-center justify-between py-3 sm:py-4 select-none transition-colors border-b border-black/[0.04] dark:border-white/[0.04] md:border-none">
      
      {/* Left: TypeRush Wordmark & Geometric Logo on Same Baseline */}
      <div 
        onClick={() => !isTestActive && onSelectTab('home')}
        className="flex items-center gap-2 cursor-pointer group shrink-0 min-h-[44px]"
      >
        <TypeRushLogo size={18} className="w-[18px] h-[18px]" />
        <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-[#F5F5F5] group-hover:text-[#FF5A00] transition-colors leading-none">
          TypeRush
        </span>
      </div>

      {/* Center: Minimal Navigation Icons (Desktop >= 768px only) */}
      <nav className="hidden md:flex items-center gap-3 sm:gap-4">
        {centerNavItems.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'home' && currentTab === 'timetrial');
          return (
            <button
              key={item.id}
              disabled={isTestActive}
              onClick={() => onSelectTab(item.id)}
              className={`p-1.5 rounded transition-colors cursor-pointer group relative ${
                isActive
                  ? 'text-[#FF5A00]'
                  : isTestActive
                  ? 'text-[#646669]/30 dark:text-[#646669]/30 cursor-not-allowed'
                  : 'text-[#646669] dark:text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>

      {/* Right: Desktop Utility Controls (>= 768px only) */}
      <div className="hidden md:flex items-center gap-2.5 sm:gap-3 text-xs text-[#646669] dark:text-[#646669]">
        
        {/* Command Palette */}
        <button
          onClick={onOpenCommandPalette}
          className="p-1.5 hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          title="Command Palette (Ctrl/Cmd + K)"
          aria-label="Command Palette"
        >
          <Command className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          title={settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}
          aria-label="Theme Toggle"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Auth / Account Area */}
        {currentUser ? (
          <div className="relative font-mono" ref={accountMenuRef}>
            <button
              onClick={() => setIsAccountMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00] transition-colors cursor-pointer text-[#111111] dark:text-[#F5F5F5]"
              title="User Account"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span className="font-bold text-xs">
                {currentProfile?.username || 'account'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#646669]" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#E5E5E5] dark:border-[#222222] bg-[#FFFFFF] dark:bg-[#0A0A0A] shadow-2xl p-1.5 z-50 animate-fadeIn text-xs">
                <div className="px-3 py-2 border-b border-[#E5E5E5] dark:border-[#222222] mb-1">
                  <span className="font-bold text-[#111111] dark:text-[#F5F5F5] block truncate">
                    {currentProfile?.displayName || currentProfile?.username}
                  </span>
                  <span className="text-[10px] text-[#646669] block truncate">
                    @{currentProfile?.username}
                  </span>
                </div>

                <button
                  onClick={() => { onSelectTab('stats'); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Statistics</span>
                </button>

                <button
                  onClick={() => { onSelectTab('multiplayer'); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Multiplayer</span>
                </button>

                <button
                  onClick={() => { onOpenSettings(); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-[#E5E5E5] dark:border-[#222222] my-1" />

                <button
                  onClick={() => { onSignOut(); setIsAccountMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#FF3B5C]/10 text-[#FF3B5C] flex items-center gap-2 font-bold cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-[#E5E5E5] dark:border-[#222222] hover:border-[#FF5A00] transition-colors cursor-pointer text-[#111111] dark:text-[#F5F5F5] font-mono text-xs font-bold"
            title="Sign in to save results and view rankings"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Sign In</span>
          </button>
        )}

      </div>

      {/* Right: Mobile Header Controls (< 768px) */}
      <div className="flex md:hidden items-center gap-1 text-xs text-[#646669] dark:text-[#646669]">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer rounded-lg active:bg-black/5 dark:active:bg-white/5"
          title={settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}
          aria-label="Theme Toggle"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#FF5A00]" />
          ) : (
            <Moon className="w-4 h-4 text-[#FF5A00]" />
          )}
        </button>

        {/* User Quick Button or Sign In Button */}
        {currentUser ? (
          <button
            onClick={() => onSelectTab('stats')}
            className="min-h-[44px] px-2.5 flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#222222] text-[#111111] dark:text-[#F5F5F5] font-mono text-xs font-bold active:bg-black/5 dark:active:bg-white/5"
            title="Account Statistics"
          >
            <UserIcon className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span className="max-w-[70px] truncate">{currentProfile?.username || 'user'}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="min-h-[44px] px-2.5 flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#222222] text-[#111111] dark:text-[#F5F5F5] font-mono text-xs font-bold active:bg-black/5 dark:active:bg-white/5"
            title="Sign In"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Sign In</span>
          </button>
        )}

        {/* Hamburger Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-[#646669] dark:text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer rounded-lg active:bg-black/5 dark:active:bg-white/5"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-[#FF5A00]" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-[#FFFFFF] dark:bg-[#0A0A0A] border-b border-[#E5E5E5] dark:border-[#222222] shadow-2xl animate-fadeIn p-4 font-mono select-none">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {centerNavItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'home' && currentTab === 'timetrial');
              return (
                <button
                  key={item.id}
                  disabled={isTestActive}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`min-h-[44px] px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF5A00]/15 text-[#FF5A00] border border-[#FF5A00]/30'
                      : isTestActive
                      ? 'text-[#646669]/30 border border-transparent cursor-not-allowed'
                      : 'border border-[#E5E5E5] dark:border-[#222222] text-[#646669] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5] active:bg-black/5 dark:active:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-[#FF5A00]' : ''}>{item.icon}</span>
                  <span className="capitalize truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#222222] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSettings();
                setIsMobileMenuOpen(false);
              }}
              className="min-h-[44px] px-3 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#222222] flex items-center gap-2.5 text-xs font-bold text-[#646669] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5] cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#FF5A00]" />
              <span>Preferences & Settings</span>
            </button>

            <button
              onClick={() => {
                onOpenCommandPalette();
                setIsMobileMenuOpen(false);
              }}
              className="min-h-[44px] px-3 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#222222] flex items-center gap-2.5 text-xs font-bold text-[#646669] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5] cursor-pointer"
            >
              <Command className="w-4 h-4 text-[#FF5A00]" />
              <span>Command Palette</span>
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  onSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="min-h-[44px] px-3 py-2.5 rounded-lg border border-[#FF3B5C]/30 bg-[#FF3B5C]/10 text-[#FF3B5C] flex items-center gap-2.5 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentProfile?.username})</span>
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
