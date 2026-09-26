import React from 'react';
import { 
  Home, 
  Target, 
  Clock, 
  FileText, 
  Trophy, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon, 
  Keyboard, 
  Menu, 
  X,
  Zap,
  Users
} from 'lucide-react';
import { UserSettings, UserProfile } from '../types/typing';

export type SidebarTab = 'home' | 'practice' | 'timetrial' | 'custom' | 'leaderboard' | 'stats' | 'tester';

interface SidebarProps {
  currentTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  settings: UserSettings;
  profile: UserProfile;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenSettings: () => void;
  isTestActive: boolean;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  settings,
  profile,
  onUpdateSettings,
  onOpenSettings,
  isTestActive,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const toggleTheme = () => {
    onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice', icon: <Target className="w-4 h-4" /> },
    { id: 'timetrial', label: 'Time Trial', icon: <Clock className="w-4 h-4" /> },
    { id: 'custom', label: 'Custom Text', icon: <FileText className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border-b border-[#E5E5E5] dark:border-[#222222] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF5A00] flex items-center justify-center text-black font-black text-sm shadow-sm">
            TR
          </div>
          <span className="font-extrabold tracking-tight text-base text-[#111111] dark:text-[#FFFFFF]">
            Type<span className="text-[#FF5A00]">Rush</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#E5E5E5] dark:border-[#222222] text-[#666666] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#FFFFFF]"
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg border border-[#E5E5E5] dark:border-[#222222] text-[#666666] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#FFFFFF]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[57px] bottom-0 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md z-30 p-4 border-b border-[#E5E5E5] dark:border-[#222222] overflow-y-auto animate-fadeIn flex flex-col justify-between">
          <div className="space-y-1">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isTestActive}
                  onClick={() => {
                    onSelectTab(item.id);
                    onToggleMobileMenu();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#FF5A00]/10 text-[#FF5A00] border-l-4 border-[#FF5A00]'
                      : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-[#FAFAFA] dark:hover:bg-[#111111] hover:text-[#111111] dark:hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#FF5A00]/20 text-[#FF5A00]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => {
                onOpenSettings();
                onToggleMobileMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[#666666] dark:text-[#A1A1A1] hover:bg-[#FAFAFA] dark:hover:bg-[#111111] hover:text-[#111111] dark:hover:text-[#FFFFFF]"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#222222] flex items-center justify-between text-xs text-[#666666] dark:text-[#A1A1A1]">
            <span>Theme: {settings.theme === 'dark' ? 'Dark' : 'Light'}</span>
            <button
              onClick={() => {
                onSelectTab('tester');
                onToggleMobileMenu();
              }}
              className="hover:text-[#FF5A00] flex items-center gap-1"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Key Tester</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col justify-between bg-[#FAFAFA] dark:bg-[#0A0A0A] border-r border-[#E5E5E5] dark:border-[#222222] min-h-screen sticky top-0 p-5 select-none font-sans">
        <div>
          {/* Brand Logo & Name */}
          <div 
            onClick={() => !isTestActive && onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer pb-6 mb-6 border-b border-[#E5E5E5] dark:border-[#222222] group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FF5A00] flex items-center justify-center text-black font-black text-sm shadow-xs group-hover:bg-[#FF6E1A] transition-colors">
              TR
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg text-[#111111] dark:text-[#FFFFFF] block leading-tight">
                Type<span className="text-[#FF5A00]">Rush</span>
              </span>
              <span className="text-[10px] text-[#666666] dark:text-[#A1A1A1] font-mono tracking-wider uppercase block">
                Productivity Platform
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isTestActive}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#FF5A00]/10 text-[#FF5A00] border-l-2 border-[#FF5A00] font-bold shadow-xs'
                      : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-white dark:hover:bg-[#111111] hover:text-[#111111] dark:hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#FF5A00]' : 'text-[#666666] dark:text-[#A1A1A1] group-hover:text-[#111111] dark:group-hover:text-[#FFFFFF]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#FF5A00]/20 text-[#FF5A00]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#666666] dark:text-[#A1A1A1] hover:bg-white dark:hover:bg-[#111111] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-all"
            >
              <Settings className="w-4 h-4 text-[#666666] dark:text-[#A1A1A1]" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Quick Controls */}
        <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#222222] space-y-3">
          {/* Quick Hardware Diagnostic Link */}
          <button
            onClick={() => onSelectTab('tester')}
            disabled={isTestActive}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              currentTab === 'tester'
                ? 'bg-[#FF5A00]/10 text-[#FF5A00] border-l-2 border-[#FF5A00]'
                : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-white dark:hover:bg-[#111111] hover:text-[#111111] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Keyboard Tester</span>
            </div>
            <span className="text-[10px] font-mono text-[#666666] dark:text-[#A1A1A1]">TEST</span>
          </button>

          {/* Theme & Sound Row */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors"
              title="Toggle Light / Dark mode"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* User Profile Mini Badge */}
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-md bg-[#FF5A00] text-black font-bold text-xs flex items-center justify-center shrink-0">
                {profile.displayName.slice(0, 1)}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-[#111111] dark:text-[#FFFFFF] block truncate">
                  {profile.displayName}
                </span>
                <span className="text-[10px] text-[#666666] dark:text-[#A1A1A1] block font-mono">
                  Competitor
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
};
