import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
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
  Check
} from 'lucide-react';
import { UserSettings, CursorStyle } from '../types/typing';
import { soundEngine } from '../utils/audioSynth';
import { supabaseRace } from '../services/supabaseRace';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>(settings.supabaseUrl || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>(settings.supabaseAnonKey || '');
  const [savedSupabase, setSavedSupabase] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSoundToggle = (enabled: boolean) => {
    onUpdateSettings({ soundEnabled: enabled });
    soundEngine.setEnabled(enabled);
    if (enabled) {
      soundEngine.playKeyPress();
    }
  };

  const handleSaveSupabase = () => {
    onUpdateSettings({
      supabaseUrl: supabaseUrlInput.trim(),
      supabaseAnonKey: supabaseKeyInput.trim(),
    });
    supabaseRace.initSupabase(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    setSavedSupabase(true);
    setTimeout(() => setSavedSupabase(false), 2000);
  };

  const cursorStyles: { id: CursorStyle; label: string; desc: string }[] = [
    { id: 'line', label: 'Blinking Line', desc: 'Minimal sleek vertical bar' },
    { id: 'block', label: 'Solid Block', desc: 'Classic terminal cursor' },
    { id: 'underline', label: 'Underline', desc: 'Subtle bottom border highlight' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            TYPERUSH Preferences
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-5 py-4 text-xs">
          
          {/* THEME */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Theme</span>
                <span className="text-slate-500 font-sans">
                  {settings.theme === 'dark' ? 'Dark Graphite (Default)' : 'Crisp Light'}
                </span>
              </div>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`px-3 py-1 font-bold rounded-lg transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`px-3 py-1 font-bold rounded-lg transition-all ${
                  settings.theme === 'light'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          {/* SOUND EFFECTS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Synthesized Audio</span>
                <span className="text-slate-500 font-sans">Web Audio API keyclicks, errors & countdown</span>
              </div>
            </div>

            <button
              onClick={() => handleSoundToggle(!settings.soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.soundEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* COUNTDOWN 3-2-1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Timer className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Pre-Test Countdown</span>
                <span className="text-slate-500 font-sans">3-2-1-GO alert before test timer begins</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ countdownEnabled: !settings.countdownEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.countdownEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* PAUSE ON TAB BLUR */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Pause className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Auto-Pause on Blur</span>
                <span className="text-slate-500 font-sans">Pause session when window or tab loses focus</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ pauseOnBlur: !settings.pauseOnBlur })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.pauseOnBlur ? 'bg-cyan-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* VIRTUAL KEYBOARD */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Keyboard className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Virtual Keyboard HUD</span>
                <span className="text-slate-500 font-sans">Live keypress reactions during typing</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ keyboardVisible: !settings.keyboardVisible })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.keyboardVisible ? 'bg-cyan-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* LIVE GRAPH */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Live Speed Curve</span>
                <span className="text-slate-500 font-sans">Mini velocity tracker during typing</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ liveGraphVisible: !settings.liveGraphVisible })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.liveGraphVisible ? 'bg-cyan-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* CURSOR STYLE */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-cyan-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Cursor Style</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {cursorStyles.map((item) => {
                const isSelected = settings.cursorStyle === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onUpdateSettings({ cursorStyle: item.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUPABASE 1V1 REALTIME BACKEND CONFIG */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-900 dark:text-white">Supabase Realtime Backend</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">1v1 Multiplayer</span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans mb-3">
              Enter your custom Supabase Project URL & Anon Key for cross-machine racing. If left blank, TYPERUSH uses the embedded BroadcastChannel engine for instant dual-window/tab racing.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrlInput}
                onChange={(e) => setSupabaseUrlInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSaveSupabase}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {savedSupabase ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{savedSupabase ? 'Credentials Saved!' : 'Save Supabase Credentials'}</span>
              </button>
            </div>
          </div>

          {/* RESET DATA */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset All Local Data</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </div>

      </div>

      {/* Confirmation Modal for Resetting Data */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-60">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Reset all TYPERUSH data?
            </h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
              This removes your TYPERUSH history, achievements, personal goals, and statistics from this browser. This action is irreversible.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetAllData();
                  setShowConfirmReset(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
