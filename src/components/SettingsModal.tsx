import React, { useState } from 'react';
import { 
  X, 
  Keyboard, 
  Activity, 
  Sun, 
  Moon, 
  Type, 
  Timer, 
  Pause, 
  Database, 
  Trash2, 
  AlertTriangle,
  Check,
  Palette,
  Eye,
  ShieldAlert,
  Sliders,
  Download,
  Upload,
  Gauge,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  UserSettings, 
  CursorStyle, 
  ThemeId, 
  BackgroundStyle, 
  StopOnError, 
  PaceCaretMode, 
  KeymapLayout, 
  KeymapMode,
  TestResult,
  PersonalBests,
  UserProfile
} from '../types/typing';
import { THEME_DEFINITIONS } from '../utils/themeEngine';
import { supabaseRace } from '../services/supabaseRace';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetAllData: () => void;
  history?: TestResult[];
  personalBests?: PersonalBests;
  profile?: UserProfile;
  onImportData?: (data: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetAllData,
  history = [],
  personalBests,
  profile,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'sound' | 'input' | 'caret' | 'keyboard' | 'conditions' | 'data'>('theme');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>(settings.supabaseUrl || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>(settings.supabaseAnonKey || '');
  const [savedSupabase, setSavedSupabase] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveSupabase = () => {
    onUpdateSettings({
      supabaseUrl: supabaseUrlInput.trim(),
      supabaseAnonKey: supabaseKeyInput.trim(),
    });
    supabaseRace.initSupabase(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    setSavedSupabase(true);
    setTimeout(() => setSavedSupabase(false), 2000);
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const backupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      settings,
      profile,
      personalBests,
      history,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `typerush_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (onImportData) {
            onImportData(parsed);
          }
          alert("Backup data imported successfully!");
        } catch {
          alert("Invalid JSON backup file.");
        }
      };
    }
  };

  const cursorStyles: { id: CursorStyle; label: string; desc: string }[] = [
    { id: 'line', label: 'Line', desc: 'Minimal vertical bar' },
    { id: 'block', label: 'Block', desc: 'Classic terminal block' },
    { id: 'underline', label: 'Underline', desc: 'Bottom border cursor' },
    { id: 'off', label: 'Hidden', desc: 'No cursor visible' },
  ];

  const backgroundStyles: { id: BackgroundStyle; label: string }[] = [
    { id: 'solid', label: 'Solid Color' },
    { id: 'grid', label: 'HUD Grid' },
    { id: 'dots', label: 'Matrix Dots' },
    { id: 'scanlines', label: 'CRT Scanlines' },
  ];

  const stopOnErrorOptions: { id: StopOnError; label: string; desc: string }[] = [
    { id: 'off', label: 'Off', desc: 'Type freely ahead of mistakes' },
    { id: 'word', label: 'Word', desc: 'Cannot space past mistyped word' },
    { id: 'letter', label: 'Letter', desc: 'Input blocked until key is correct' },
  ];

  const paceOptions: { id: PaceCaretMode; label: string }[] = [
    { id: 'off', label: 'Disabled' },
    { id: 'pb', label: 'Personal Best' },
    { id: 'average', label: 'Lifetime Average' },
    { id: 'custom', label: 'Custom Target WPM' },
  ];

  const keymapLayouts: { id: KeymapLayout; label: string }[] = [
    { id: 'qwerty', label: 'QWERTY' },
    { id: 'qwertz', label: 'QWERTZ' },
    { id: 'azerty', label: 'AZERTY' },
    { id: 'dvorak', label: 'Dvorak' },
    { id: 'colemak', label: 'Colemak' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#111111] border border-[#D8D6D1] dark:border-[#242424] rounded p-6 sm:p-8 shadow-2xl transition-all max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D8D6D1] dark:border-[#242424]">
          <div>
            <h3 className="text-lg font-black text-[#111111] dark:text-white">
              TYPERUSH Preferences
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] font-sans">
              Engine rules, themes, audio, caret & data settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#1A1A1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-3 border-b border-[#D8D6D1] dark:border-[#242424] mb-4 text-xs font-bold">
          {[
            { id: 'theme', label: 'Themes' },
            { id: 'input', label: 'Input Rules' },
            { id: 'caret', label: 'Caret & Pace' },
            { id: 'keyboard', label: 'Keyboard' },
            { id: 'conditions', label: 'Conditions' },
            { id: 'data', label: 'Data & Supabase' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#FF5A00] text-black font-black shadow-sm'
                  : 'text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#1A1A1A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: THEMES & BACKGROUND PATTERNS */}
        {activeTab === 'theme' && (
          <div className="space-y-5 text-xs">
            <div>
              <span className="font-bold text-[#111111] dark:text-white block mb-2">Preset Themes (10+ Original Palettes)</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(THEME_DEFINITIONS).map(themeDef => {
                  const isSelected = settings.themeId === themeDef.id;
                  return (
                    <div
                      key={themeDef.id}
                      onClick={() => onUpdateSettings({ themeId: themeDef.id, theme: themeDef.isDark ? 'dark' : 'light' })}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#FF5A00] ring-2 ring-[#FF5A00]/30 bg-[#FF5A00]/10' 
                          : 'border-[#D8D6D1] dark:border-[#242424] hover:border-[#FF5A00]/40 bg-[#F7F7F7] dark:bg-[#080808]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: themeDef.colors.primary }} />
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: themeDef.colors.bg }} />
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: themeDef.colors.surface }} />
                      </div>
                      <span className="font-bold text-[#111111] dark:text-white block text-xs truncate">{themeDef.name}</span>
                      <span className="text-[10px] text-[#666666] dark:text-[#71717A] font-sans block truncate">{themeDef.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Theme Color Builder if 'custom' theme selected */}
            {settings.themeId === 'custom' && (
              <div className="p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#080808] border border-[#D8D6D1] dark:border-[#242424] space-y-3">
                <span className="font-bold text-[#111111] dark:text-white block">Custom Theme Colors</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#666666] dark:text-[#71717A] block mb-1">Primary Accent:</label>
                    <input
                      type="color"
                      value={settings.customColors?.primary || '#FF5A00'}
                      onChange={e => onUpdateSettings({
                        customColors: {
                          ...settings.customColors,
                          bg: settings.customColors?.bg || '#080808',
                          surface: settings.customColors?.surface || '#111111',
                          border: settings.customColors?.border || '#242424',
                          text: settings.customColors?.text || '#ffffff',
                          primary: e.target.value,
                          error: settings.customColors?.error || '#FF3B5C',
                        }
                      })}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-[#D8D6D1] dark:border-[#242424]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#666666] dark:text-[#71717A] block mb-1">Background:</label>
                    <input
                      type="color"
                      value={settings.customColors?.bg || '#080808'}
                      onChange={e => onUpdateSettings({
                        customColors: {
                          ...settings.customColors,
                          bg: e.target.value,
                          surface: settings.customColors?.surface || '#111111',
                          border: settings.customColors?.border || '#242424',
                          text: settings.customColors?.text || '#ffffff',
                          primary: settings.customColors?.primary || '#FF5A00',
                          error: settings.customColors?.error || '#FF3B5C',
                        }
                      })}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-[#D8D6D1] dark:border-[#242424]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Background Style Pattern */}
            <div className="pt-2 border-t border-[#D8D6D1] dark:border-[#242424]">
              <span className="font-bold text-[#111111] dark:text-white block mb-2">Background Pattern Texture</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {backgroundStyles.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => onUpdateSettings({ backgroundStyle: bg.id })}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                      settings.backgroundStyle === bg.id
                        ? 'bg-[#FF5A00]/20 border-[#FF5A00] text-[#FF5A00]'
                        : 'border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADVANCED INPUT RULES */}
        {activeTab === 'input' && (
          <div className="space-y-4 text-xs font-mono">
            {/* Confidence Mode */}
            <div className="flex items-center justify-between p-3.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808]">
              <div>
                <span className="font-bold text-[#111111] dark:text-white block">Confidence Mode</span>
                <span className="text-[#666666] dark:text-[#71717A] font-sans">Completely disables Backspace. Forces commitment.</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ confidenceMode: !settings.confidenceMode })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  settings.confidenceMode ? 'bg-[#FF5A00] justify-end' : 'bg-[#D8D6D1] dark:bg-[#242424] justify-start'
                }`}
              >
                <span className={`w-5 h-5 rounded-full shadow ${settings.confidenceMode ? 'bg-black' : 'bg-white dark:bg-[#71717A]'}`} />
              </button>
            </div>

            {/* Stop on Error */}
            <div className="p-3.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808]">
              <span className="font-bold text-[#111111] dark:text-white block mb-2">Stop on Error Behavior</span>
              <div className="grid grid-cols-3 gap-2">
                {stopOnErrorOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateSettings({ stopOnError: opt.id })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      settings.stopOnError === opt.id
                        ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-bold shadow-[0_0_12px_rgba(255,90,0,0.15)]'
                        : 'border-[#D8D6D1] dark:border-[#242424] bg-white dark:bg-[#111111] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    <span className="block">{opt.label}</span>
                    <span className="text-[10px] text-[#888888] dark:text-[#71717A] font-sans">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Strict Space */}
            <div className="flex items-center justify-between p-3.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808]">
              <div>
                <span className="font-bold text-[#111111] dark:text-white block">Strict Space</span>
                <span className="text-[#666666] dark:text-[#71717A] font-sans">Blocks Space key until the current word is fully typed.</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ strictSpace: !settings.strictSpace })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  settings.strictSpace ? 'bg-[#FF5A00] justify-end' : 'bg-[#D8D6D1] dark:bg-[#242424] justify-start'
                }`}
              >
                <span className={`w-5 h-5 rounded-full shadow ${settings.strictSpace ? 'bg-black' : 'bg-white dark:bg-[#71717A]'}`} />
              </button>
            </div>

            {/* Blind Mode */}
            <div className="flex items-center justify-between p-3.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808]">
              <div>
                <span className="font-bold text-[#111111] dark:text-white block">Blind Mode</span>
                <span className="text-[#666666] dark:text-[#71717A] font-sans">Hides character correct/error highlights during typing.</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ blindMode: !settings.blindMode })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  settings.blindMode ? 'bg-[#FF5A00] justify-end' : 'bg-[#D8D6D1] dark:bg-[#242424] justify-start'
                }`}
              >
                <span className={`w-5 h-5 rounded-full shadow ${settings.blindMode ? 'bg-black' : 'bg-white dark:bg-[#71717A]'}`} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CARET & PACE */}
        {activeTab === 'caret' && (
          <div className="space-y-5 text-xs font-mono">
            <div>
              <span className="font-bold text-[#111111] dark:text-white block mb-2">Caret Visual Style</span>
              <div className="grid grid-cols-2 gap-2">
                {cursorStyles.map(c => (
                  <div
                    key={c.id}
                    onClick={() => onUpdateSettings({ cursorStyle: c.id })}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      settings.cursorStyle === c.id
                        ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-bold shadow-[0_0_12px_rgba(255,90,0,0.15)]'
                        : 'border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="block text-[10px] text-[#888888] dark:text-[#71717A] font-sans">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#D8D6D1] dark:border-[#242424]">
              <span className="font-bold text-[#111111] dark:text-white block mb-2">Pace Caret (Ghost Racer)</span>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {paceOptions.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onUpdateSettings({ paceCaret: p.id })}
                    className={`p-2.5 rounded border text-xs font-bold transition-all ${
                      settings.paceCaret === p.id
                        ? 'bg-[#FF6E1A]/15 border-[#FF6E1A] text-[#FF6E1A] shadow-[0_0_12px_rgba(255,122,24,0.15)]'
                        : 'border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {settings.paceCaret === 'custom' && (
                <div className="flex items-center gap-2 p-3 bg-[#F7F7F7] dark:bg-[#080808] rounded border border-[#D8D6D1] dark:border-[#242424]">
                  <span className="text-[#666666] dark:text-[#A1A1AA]">Target Pace WPM:</span>
                  <input
                    type="number"
                    min={20}
                    max={250}
                    value={settings.paceWpm || 80}
                    onChange={e => onUpdateSettings({ paceWpm: parseInt(e.target.value, 10) || 80 })}
                    className="w-20 bg-white dark:bg-[#111111] px-2.5 py-1 rounded-lg border border-[#D8D6D1] dark:border-[#242424] text-[#111111] dark:text-white font-bold focus:border-[#FF6E1A] focus:outline-none"
                  />
                  <span className="text-[#888888] dark:text-[#71717A]">WPM ghost speed</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: KEYBOARD LAYOUT */}
        {activeTab === 'keyboard' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3.5 rounded border border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808]">
              <div>
                <span className="font-bold text-[#111111] dark:text-white block">Virtual Keyboard HUD</span>
                <span className="text-[#666666] dark:text-[#71717A] font-sans">Show on-screen keystroke tracker</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ keyboardVisible: !settings.keyboardVisible })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  settings.keyboardVisible ? 'bg-[#FF5A00] justify-end' : 'bg-[#D8D6D1] dark:bg-[#242424] justify-start'
                }`}
              >
                <span className={`w-5 h-5 rounded-full shadow ${settings.keyboardVisible ? 'bg-black' : 'bg-white dark:bg-[#71717A]'}`} />
              </button>
            </div>

            <div>
              <span className="font-bold text-[#111111] dark:text-white block mb-2">Keymap Layout</span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {keymapLayouts.map(km => (
                  <button
                    key={km.id}
                    onClick={() => onUpdateSettings({ keymapLayout: km.id })}
                    className={`p-2.5 rounded border text-xs font-bold transition-all ${
                      settings.keymapLayout === km.id
                        ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] shadow-[0_0_12px_rgba(255,90,0,0.15)]'
                        : 'border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    {km.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-[#111111] dark:text-white block mb-2">Keymap Mode</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateSettings({ keymapMode: 'reactive' })}
                  className={`p-3 rounded border text-left transition-all ${
                    settings.keymapMode === 'reactive'
                      ? 'bg-[#FF5A00]/10 border-[#FF5A00] text-[#FF5A00] font-bold shadow-[0_0_12px_rgba(255,90,0,0.15)]'
                      : 'border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <span className="block font-bold">Reactive</span>
                  <span className="text-[10px] text-[#888888] dark:text-[#71717A] font-sans">Lights up on keypress</span>
                </button>

                <button
                  onClick={() => onUpdateSettings({ keymapMode: 'next-key' })}
                  className={`p-3 rounded border text-left transition-all ${
                    settings.keymapMode === 'next-key'
                      ? 'bg-[#FF6E1A]/15 border-[#FF6E1A] text-[#FF6E1A] font-bold shadow-[0_0_12px_rgba(255,122,24,0.15)]'
                      : 'border-[#D8D6D1] dark:border-[#242424] bg-[#F7F7F7] dark:bg-[#080808] text-[#666666] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <span className="block font-bold">Next-Key Guide</span>
                  <span className="text-[10px] text-[#888888] dark:text-[#71717A] font-sans">Glows upcoming letter</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MINIMUM PERFORMANCE CONDITIONS */}
        {activeTab === 'conditions' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 bg-[#F7F7F7] dark:bg-[#080808] rounded border border-[#D8D6D1] dark:border-[#242424]">
              <span className="font-bold text-[#111111] dark:text-white block mb-1">Minimum WPM Threshold</span>
              <span className="text-[#666666] dark:text-[#71717A] font-sans block mb-2">
                If typing speed falls below this after 5 seconds, test fails immediately. (0 = disabled)
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={140}
                  step={5}
                  value={settings.minWpm || 0}
                  onChange={e => onUpdateSettings({ minWpm: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#FF5A00] cursor-pointer"
                />
                <span className="font-bold text-[#FF5A00] w-16 text-right">
                  {settings.minWpm ? `${settings.minWpm} WPM` : 'OFF'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#F7F7F7] dark:bg-[#080808] rounded border border-[#D8D6D1] dark:border-[#242424]">
              <span className="font-bold text-[#111111] dark:text-white block mb-1">Minimum Accuracy Threshold</span>
              <span className="text-[#666666] dark:text-[#71717A] font-sans block mb-2">
                If accuracy falls below this after 10 characters, test fails immediately. (0 = disabled)
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={98}
                  step={2}
                  value={settings.minAccuracy || 0}
                  onChange={e => onUpdateSettings({ minAccuracy: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#FF5A00] cursor-pointer"
                />
                <span className="font-bold text-[#FF5A00] w-16 text-right">
                  {settings.minAccuracy ? `${settings.minAccuracy}%` : 'OFF'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DATA IMPORT/EXPORT & SUPABASE */}
        {activeTab === 'data' && (
          <div className="space-y-5 text-xs font-mono">
            {/* JSON Export / Import */}
            <div className="p-4 bg-[#F7F7F7] dark:bg-[#080808] rounded border border-[#D8D6D1] dark:border-[#242424] space-y-3">
              <span className="font-bold text-[#111111] dark:text-white block">Data Backup & Sync (JSON)</span>
              <p className="text-[#666666] dark:text-[#A1A1AA] font-sans text-xs">
                Export your full history, personal bests, and preferences to a portable JSON file.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportJson}
                  className="px-4 py-2 rounded-lg bg-[#FF5A00] text-black font-bold flex items-center gap-1.5 hover:shadow-[0_0_16px_rgba(255,90,0,0.4)] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>EXPORT DATA (JSON)</span>
                </button>

                <label className="px-4 py-2 rounded-lg bg-white dark:bg-[#111111] text-[#111111] dark:text-white font-bold flex items-center gap-1.5 hover:border-[#FF5A00] cursor-pointer transition-all border border-[#D8D6D1] dark:border-[#242424]">
                  <Upload className="w-4 h-4" />
                  <span>IMPORT DATA</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Supabase Multiplayer Race Settings */}
            <div className="p-4 bg-[#F7F7F7] dark:bg-[#080808] rounded border border-[#D8D6D1] dark:border-[#242424] space-y-3">
              <span className="font-bold text-[#111111] dark:text-white block">Supabase Multiplayer Race Setup</span>
              <input
                type="text"
                value={supabaseUrlInput}
                onChange={e => setSupabaseUrlInput(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#111111] border border-[#D8D6D1] dark:border-[#242424] text-[#111111] dark:text-white text-xs focus:outline-none focus:border-[#FF5A00]"
              />
              <input
                type="password"
                value={supabaseKeyInput}
                onChange={e => setSupabaseKeyInput(e.target.value)}
                placeholder="Supabase Anon Key"
                className="w-full p-2.5 rounded-lg bg-white dark:bg-[#111111] border border-[#D8D6D1] dark:border-[#242424] text-[#111111] dark:text-white text-xs focus:outline-none focus:border-[#FF5A00]"
              />
              <button
                onClick={handleSaveSupabase}
                className="px-4 py-2 rounded-lg bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/30 hover:border-[#FF5A00] font-bold flex items-center gap-1.5 transition-all"
              >
                {savedSupabase ? <Check className="w-4 h-4" /> : null}
                <span>{savedSupabase ? 'Credentials Saved!' : 'Save Supabase Credentials'}</span>
              </button>
            </div>

            {/* Danger Zone: Reset All */}
            <div className="pt-4 border-t border-[#D8D6D1] dark:border-[#242424] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#FF3B5C] block">Reset All Local Data</span>
                <span className="text-[#666666] dark:text-[#71717A] font-sans">Clear all history, personal bests, and profile settings</span>
              </div>
              <button
                onClick={() => setShowConfirmReset(true)}
                className="px-4 py-2 rounded-lg bg-[#FF3B5C]/10 text-[#FF3B5C] border border-[#FF3B5C]/30 hover:bg-[#FF3B5C] hover:text-white font-bold transition-all"
              >
                Reset Everything
              </button>
            </div>

            {showConfirmReset && (
              <div className="p-4 rounded bg-[#FF3B5C]/10 border border-[#FF3B5C]/40 text-[#FF3B5C] space-y-2">
                <p className="font-bold">Are you sure? This cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={onResetAllData}
                    className="px-3.5 py-1.5 bg-[#FF3B5C] text-white rounded-lg font-bold hover:shadow-[0_0_12px_rgba(255,59,92,0.4)] transition-all"
                  >
                    Confirm Permanent Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3.5 py-1.5 bg-white dark:bg-[#111111] border border-[#D8D6D1] dark:border-[#242424] text-[#111111] dark:text-white rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
