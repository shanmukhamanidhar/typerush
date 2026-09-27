import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Settings as SettingsIcon, 
  Sliders, 
  Keyboard, 
  Volume2, 
  MousePointer, 
  Palette, 
  EyeOff, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { UserSettings, DifficultyRule, QuickRestartOption, CaretAnimationOption, CaretColorOption, TypingSoundOption, FontSizeOption, FontFamilyOption, UiDensityOption, TextOpacityOption, StopOnError, CursorStyle, ThemeId } from '../../types/typing';
import { SettingControl } from './SettingControl';
import { SettingsSection } from './SettingsSection';
import { SettingsService, DEFAULT_USER_SETTINGS } from '../../services/settingsService';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetSettings: () => void;
  onClearHistory: () => void;
  onClearStats: () => void;
  onResetAll: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  onClearHistory,
  onClearStats,
  onResetAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('behavior');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  } | null>(null);

  const matchedSections = useMemo(() => {
    return SettingsService.searchSettings(searchQuery);
  }, [searchQuery]);

  const navItems = [
    { id: 'behavior', label: 'Behavior', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'input', label: 'Input', icon: <Keyboard className="w-3.5 h-3.5" /> },
    { id: 'sound', label: 'Sound', icon: <Volume2 className="w-3.5 h-3.5" /> },
    { id: 'caret', label: 'Caret', icon: <MousePointer className="w-3.5 h-3.5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'theme', label: 'Theme', icon: <SettingsIcon className="w-3.5 h-3.5" /> },
    { id: 'hideElements', label: 'Hide Elements', icon: <EyeOff className="w-3.5 h-3.5" /> },
    { id: 'dangerZone', label: 'Danger Zone', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 select-none font-mono animate-fadeIn space-y-6">
      
      {/* Header & Real-time Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#222222]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] dark:text-[#F5F5F5] flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#FF5A00]" />
            <span>Settings</span>
          </h1>
          <p className="text-xs text-[#646669] mt-0.5">
            Configure typing behavior, aesthetics, input cadence, and precision instruments.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#646669] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#222222] bg-black/[0.02] dark:bg-white/[0.02] text-base sm:text-xs text-[#111111] dark:text-[#F5F5F5] placeholder-[#646669] outline-none focus:border-[#FF5A00] transition-colors"
          />
        </div>
      </div>

      {/* Sticky Compact Navigation Bar */}
      <div className="sticky top-0 z-20 bg-[#FFFFFF]/90 dark:bg-[#000000]/90 backdrop-blur-md py-2 border-b border-[#E5E5E5] dark:border-[#222222] overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max text-xs">
          {navItems.map((item) => {
            const isVisible = matchedSections.includes(item.id);
            if (!isVisible) return null;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black/10 dark:bg-white/10 text-[#FF5A00] font-bold'
                    : 'text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. BEHAVIOR SECTION */}
      {matchedSections.includes('behavior') && (
        <SettingsSection id="behavior" title="Behavior" icon={<Sliders className="w-4 h-4" />}>
          <SettingControl<DifficultyRule>
            title="Difficulty"
            description="Controls how strict the test engine evaluates miskeys and submission boundaries."
            value={settings.difficultyRule || 'normal'}
            onChange={(val) => onUpdateSettings({ difficultyRule: val })}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'expert', label: 'Expert' },
              { value: 'master', label: 'Master' },
            ]}
          />

          <SettingControl<QuickRestartOption>
            title="Quick Restart"
            description="Keyboard key assigned to instantly restart a fresh typing session."
            value={settings.quickRestart || 'tab'}
            onChange={(val) => onUpdateSettings({ quickRestart: val })}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'esc', label: 'Esc' },
              { value: 'tab', label: 'Tab' },
              { value: 'enter', label: 'Enter' },
            ]}
          />

          <SettingControl<'off' | 'typing'>
            title="Repeat Quotes"
            description="Allows replaying the same quote immediately to practice identical phrasing."
            value={settings.repeatQuotes || 'off'}
            onChange={(val) => onUpdateSettings({ repeatQuotes: val })}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'typing', label: 'While Typing' },
            ]}
          />

          <SettingControl<boolean>
            title="Blind Mode"
            description="Hides error and success color indicators during the test for distraction-free typing."
            value={settings.blindMode}
            onChange={(val) => onUpdateSettings({ blindMode: val })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Always Show Words History"
            description="Keeps past completed words visible as you advance through subsequent lines."
            value={settings.alwaysShowWordsHistory || false}
            onChange={(val) => onUpdateSettings({ alwaysShowWordsHistory: val })}
            type="toggle"
          />

          <SettingControl<'manual' | 'on'>
            title="Single List Command Line"
            description="Display commands and shortcuts as an editorial single list palette."
            value={settings.singleListCommandLine || 'manual'}
            onChange={(val) => onUpdateSettings({ singleListCommandLine: val })}
            options={[
              { value: 'manual', label: 'Manual' },
              { value: 'on', label: 'On' },
            ]}
          />

          <SettingControl<number>
            title="Minimum Speed (WPM)"
            description="Automatically fails the test if your rolling pace falls below this value (0 = Off)."
            value={settings.minWpm || 0}
            onChange={(val) => onUpdateSettings({ minWpm: val })}
            type="number"
            min={0}
            max={200}
            step={5}
          />

          <SettingControl<number>
            title="Minimum Accuracy (%)"
            description="Automatically fails the session if overall accuracy falls below this threshold (0 = Off)."
            value={settings.minAccuracy || 0}
            onChange={(val) => onUpdateSettings({ minAccuracy: val })}
            type="number"
            min={0}
            max={100}
            step={1}
          />
        </SettingsSection>
      )}

      {/* 2. INPUT SECTION */}
      {matchedSections.includes('input') && (
        <SettingsSection id="input" title="Input" icon={<Keyboard className="w-4 h-4" />}>
          <SettingControl<'standard' | 'strict'>
            title="Input Mode"
            description="Standard permits free keystroke buffering; Strict requires sequential precision."
            value={settings.inputMode || 'standard'}
            onChange={(val) => onUpdateSettings({ inputMode: val })}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'strict', label: 'Strict' },
            ]}
          />

          <SettingControl<StopOnError>
            title="Stop On Error"
            description="Prevents advancing past invalid input until corrected."
            value={settings.stopOnError}
            onChange={(val) => onUpdateSettings({ stopOnError: val })}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'letter', label: 'Letter' },
              { value: 'word', label: 'Word' },
            ]}
          />

          <SettingControl<boolean>
            title="Confidence Mode"
            description="Disables backspace completely to build unhesitating forward momentum."
            value={settings.confidenceMode}
            onChange={(val) => onUpdateSettings({ confidenceMode: val })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Freedom Mode"
            description="Allows typing extra characters beyond word boundary without blocking."
            value={settings.freedomMode}
            onChange={(val) => onUpdateSettings({ freedomMode: val })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Strict Space"
            description="Requires typing all characters in the current word before space advances to the next."
            value={settings.strictSpace}
            onChange={(val) => onUpdateSettings({ strictSpace: val })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Quick End"
            description="Finishes the test immediately upon entering the final character of the passage."
            value={settings.quickEnd}
            onChange={(val) => onUpdateSettings({ quickEnd: val })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Pause On Blur"
            description="Automatically pauses the active timer if you tab away or unfocus the browser window."
            value={settings.pauseOnBlur}
            onChange={(val) => onUpdateSettings({ pauseOnBlur: val })}
            type="toggle"
          />
        </SettingsSection>
      )}

      {/* 3. SOUND SECTION */}
      {matchedSections.includes('sound') && (
        <SettingsSection id="sound" title="Sound" icon={<Volume2 className="w-4 h-4" />}>
          <SettingControl<boolean>
            title="Sound"
            description="Enable subtle, non-intrusive UI audio feedback (no annoying mechanical clatter)."
            value={settings.soundEnabled}
            onChange={(val) => onUpdateSettings({ soundEnabled: val })}
            type="toggle"
          />

          <SettingControl<TypingSoundOption>
            title="Typing Sound"
            description="Select subtle acoustic profile for keypress feedback."
            value={settings.typingSound || 'soft'}
            onChange={(val) => onUpdateSettings({ typingSound: val })}
            options={[
              { value: 'soft', label: 'Soft' },
              { value: 'click', label: 'Click' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'custom', label: 'Custom' },
            ]}
          />

          <SettingControl<number>
            title="Volume"
            description="Adjust master volume level for subtle audio tones."
            value={settings.soundVolume || 35}
            onChange={(val) => onUpdateSettings({ soundVolume: val })}
            type="slider"
            min={0}
            max={100}
            step={5}
          />

          <SettingControl<boolean>
            title="Error Sound"
            description="Play a subtle muted blip when a miskey is registered."
            value={settings.errorSound || false}
            onChange={(val) => onUpdateSettings({ errorSound: val })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Completion Sound"
            description="Play a gentle harmonic chime when the test successfully finishes."
            value={settings.completionSound || false}
            onChange={(val) => onUpdateSettings({ completionSound: val })}
            type="toggle"
          />
        </SettingsSection>
      )}

      {/* 4. CARET SECTION */}
      {matchedSections.includes('caret') && (
        <SettingsSection id="caret" title="Caret" icon={<MousePointer className="w-4 h-4" />}>
          <SettingControl<CursorStyle>
            title="Caret Style"
            description="Visual shape of the precision typing indicator."
            value={settings.cursorStyle}
            onChange={(val) => onUpdateSettings({ cursorStyle: val })}
            options={[
              { value: 'line', label: 'Line' },
              { value: 'block', label: 'Block' },
              { value: 'underline', label: 'Underline' },
            ]}
          />

          <SettingControl<CaretAnimationOption>
            title="Caret Animation"
            description="Motion dynamics of the cursor between characters."
            value={settings.caretAnimation || 'smooth'}
            onChange={(val) => onUpdateSettings({ caretAnimation: val })}
            options={[
              { value: 'smooth', label: 'Smooth' },
              { value: 'static', label: 'Static' },
              { value: 'blink', label: 'Blink' },
            ]}
          />

          <SettingControl<CaretColorOption>
            title="Caret Color"
            description="Select whether the cursor uses the signature TypeRush orange or neutral tone."
            value={settings.caretColor || 'accent'}
            onChange={(val) => onUpdateSettings({ caretColor: val })}
            options={[
              { value: 'accent', label: 'Accent (#FF5A00)' },
              { value: 'neutral', label: 'Neutral' },
            ]}
          />

          <SettingControl<number>
            title="Caret Opacity"
            description="Adjust cursor transparency level."
            value={settings.caretOpacity || 100}
            onChange={(val) => onUpdateSettings({ caretOpacity: val })}
            type="slider"
            min={20}
            max={100}
            step={5}
          />
        </SettingsSection>
      )}

      {/* 5. APPEARANCE SECTION */}
      {matchedSections.includes('appearance') && (
        <SettingsSection id="appearance" title="Appearance" icon={<Palette className="w-4 h-4" />}>
          <SettingControl<'dark' | 'light' | 'system'>
            title="Theme Mode"
            description="Pure black in Dark mode (#000000); Pure white in Light mode (#FFFFFF)."
            value={settings.theme}
            onChange={(val) => onUpdateSettings({ theme: val })}
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
              { value: 'system', label: 'System' },
            ]}
          />

          <SettingControl<TextOpacityOption>
            title="Text Opacity"
            description="Visual contrast balance for pending and upcoming characters."
            value={settings.textOpacity || 'primary'}
            onChange={(val) => onUpdateSettings({ textOpacity: val })}
            options={[
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'muted', label: 'Muted' },
            ]}
          />

          <SettingControl<FontSizeOption>
            title="Font Size"
            description="Text scale of the central typing workspace."
            value={settings.fontSize || 'md'}
            onChange={(val) => onUpdateSettings({ fontSize: val })}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Normal' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' },
            ]}
          />

          <SettingControl<FontFamilyOption>
            title="Font Family"
            description="Typography typeface for the typing text."
            value={settings.fontFamily || 'times'}
            onChange={(val) => onUpdateSettings({ fontFamily: val })}
            options={[
              { value: 'times', label: 'Times New Roman' },
              { value: 'mono', label: 'TypeRush Mono' },
              { value: 'sans', label: 'System Mono' },
            ]}
          />

          <SettingControl<UiDensityOption>
            title="UI Density"
            description="Spacing rhythm across controls, metrics, and navigation elements."
            value={settings.uiDensity || 'comfortable'}
            onChange={(val) => onUpdateSettings({ uiDensity: val })}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
            ]}
          />
        </SettingsSection>
      )}

      {/* 6. THEME PRESETS SECTION */}
      {matchedSections.includes('theme') && (
        <SettingsSection id="theme" title="Theme Palette" icon={<SettingsIcon className="w-4 h-4" />}>
          <SettingControl<ThemeId>
            title="Theme Preset"
            description="Technical design tokens adhering to pure black/white foundations with orange accent."
            value={settings.themeId}
            onChange={(val) => onUpdateSettings({ themeId: val })}
            options={[
              { value: 'graphite-cyan', label: 'Precision Orange (Official)' },
              { value: 'obsidian', label: 'Obsidian Stealth' },
              { value: 'cyberpunk', label: 'Crimson Ember' },
              { value: 'terminal80', label: 'Terminal Orange' },
              { value: 'paper-light', label: 'Paper Light' },
              { value: 'monochrome', label: 'Monochrome' },
            ]}
          />
        </SettingsSection>
      )}

      {/* 7. HIDE ELEMENTS SECTION */}
      {matchedSections.includes('hideElements') && (
        <SettingsSection id="hideElements" title="Hide Elements" icon={<EyeOff className="w-4 h-4" />}>
          <SettingControl<boolean>
            title="Header"
            description="Hide top navigation bar during sessions."
            value={settings.hideElements?.header || false}
            onChange={(val) => onUpdateSettings({ hideElements: { ...settings.hideElements, header: val } })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Footer & Shortcuts"
            description="Hide bottom restart button and keyboard shortcut indicators."
            value={settings.hideElements?.footer || false}
            onChange={(val) => onUpdateSettings({ hideElements: { ...settings.hideElements, footer: val } })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Live Timer"
            description="Hide countdown and elapsed seconds from the live metric row."
            value={settings.hideElements?.timer || false}
            onChange={(val) => onUpdateSettings({ hideElements: { ...settings.hideElements, timer: val } })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Live Accuracy"
            description="Hide real-time accuracy percentage during typing."
            value={settings.hideElements?.accuracy || false}
            onChange={(val) => onUpdateSettings({ hideElements: { ...settings.hideElements, accuracy: val } })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Live WPM"
            description="Hide live WPM calculation counter during active typing."
            value={settings.hideElements?.wpm || false}
            onChange={(val) => onUpdateSettings({ hideElements: { ...settings.hideElements, wpm: val } })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Progress Bar"
            description="Hide sleek progress line beneath the metric row."
            value={settings.hideElements?.progressBar || false}
            onChange={(val) => onUpdateSettings({ hideElements: { ...settings.hideElements, progressBar: val } })}
            type="toggle"
          />

          <SettingControl<boolean>
            title="Test Configuration Bar"
            description="Hide top mode/time/word selector pills."
            value={settings.hideElements?.testConfig || false}
            onChange={(val) => onUpdateSettings({ hideElements: { ...settings.hideElements, testConfig: val } })}
            type="toggle"
          />
        </SettingsSection>
      )}

      {/* 8. DANGER ZONE SECTION */}
      {matchedSections.includes('dangerZone') && (
        <SettingsSection id="dangerZone" title="Danger Zone" icon={<AlertTriangle className="w-4 h-4 text-[#FF3B5C]" />}>
          <SettingControl
            title="Reset Settings"
            description="Restores all TypeRush preferences to factory defaults without deleting test history."
            type="action"
            actionLabel="Reset Settings"
            onAction={() => {
              setConfirmModal({
                isOpen: true,
                title: 'Reset Settings to Default?',
                description: 'This will reset your theme, caret, sound, and input preferences to default TypeRush values.',
                action: onResetSettings,
              });
            }}
          />

          <SettingControl
            title="Clear Local Test History"
            description="Permanently deletes all stored test logs and session records from your browser."
            type="action"
            actionLabel="Clear History"
            isDestructive={true}
            onAction={() => {
              setConfirmModal({
                isOpen: true,
                title: 'Clear All Test History?',
                description: 'This action cannot be undone. All completed test records will be permanently erased.',
                action: onClearHistory,
              });
            }}
          />

          <SettingControl
            title="Clear Statistics & Personal Bests"
            description="Resets all recorded peak WPM records and leaderboard qualifications to zero."
            type="action"
            actionLabel="Clear Stats"
            isDestructive={true}
            onAction={() => {
              setConfirmModal({
                isOpen: true,
                title: 'Reset Personal Bests?',
                description: 'All 15s, 30s, 60s, and high-score records will be reset to zero.',
                action: onClearStats,
              });
            }}
          />

          <SettingControl
            title="Reset All Preferences"
            description="Performs a complete factory wipe of all local data, settings, history, and records."
            type="action"
            actionLabel="Factory Reset"
            isDestructive={true}
            onAction={() => {
              setConfirmModal({
                isOpen: true,
                title: 'Factory Reset TypeRush?',
                description: 'This will wipe all preferences, personal bests, history, and theme configurations from localStorage.',
                action: onResetAll,
              });
            }}
          />
        </SettingsSection>
      )}

      {/* Confirmation Modal */}
      {confirmModal?.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setConfirmModal(null)}
        >
          <div 
            className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#222222] rounded-xl p-6 shadow-2xl font-mono space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-[#FF3B5C]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#111111] dark:text-[#F5F5F5]">
                {confirmModal.title}
              </h3>
            </div>

            <p className="text-xs text-[#646669] leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E5E5] dark:border-[#222222]">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-3 py-1.5 rounded text-xs text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.action();
                  setConfirmModal(null);
                }}
                className="px-3 py-1.5 rounded bg-[#FF3B5C] hover:bg-[#FF3B5C]/90 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
