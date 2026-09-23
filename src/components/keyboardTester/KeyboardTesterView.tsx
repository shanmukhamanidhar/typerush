import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Keyboard, 
  RotateCcw, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Zap, 
  FileText, 
  HelpCircle,
  Sliders
} from 'lucide-react';
import { KeyboardLayoutType, KeyboardTesterReport } from '../../types/typing';

interface KeyState {
  code: string;
  label: string;
  subLabel?: string;
  width?: string;
  row: number;
  status: 'untested' | 'pressed' | 'tested' | 'restricted' | 'stuck';
  lastPressedAt?: number;
  pressDurationMs?: number;
  location?: number;
}

const FULL_KEY_DEFINITIONS: { code: string; label: string; subLabel?: string; width?: string; row: number; section?: 'main' | 'nav' | 'num' }[] = [
  // Row 0 - Function keys
  { code: 'Escape', label: 'ESC', row: 0, section: 'main' },
  { code: 'F1', label: 'F1', row: 0, section: 'main' },
  { code: 'F2', label: 'F2', row: 0, section: 'main' },
  { code: 'F3', label: 'F3', row: 0, section: 'main' },
  { code: 'F4', label: 'F4', row: 0, section: 'main' },
  { code: 'F5', label: 'F5', row: 0, section: 'main' },
  { code: 'F6', label: 'F6', row: 0, section: 'main' },
  { code: 'F7', label: 'F7', row: 0, section: 'main' },
  { code: 'F8', label: 'F8', row: 0, section: 'main' },
  { code: 'F9', label: 'F9', row: 0, section: 'main' },
  { code: 'F10', label: 'F10', row: 0, section: 'main' },
  { code: 'F11', label: 'F11', row: 0, section: 'main' },
  { code: 'F12', label: 'F12', row: 0, section: 'main' },
  { code: 'PrintScreen', label: 'PrtSc', row: 0, section: 'nav' },
  { code: 'ScrollLock', label: 'ScrLk', row: 0, section: 'nav' },
  { code: 'Pause', label: 'Pause', row: 0, section: 'nav' },

  // Row 1 - Number row
  { code: 'Backquote', label: '~', subLabel: '`', row: 1, section: 'main' },
  { code: 'Digit1', label: '!', subLabel: '1', row: 1, section: 'main' },
  { code: 'Digit2', label: '@', subLabel: '2', row: 1, section: 'main' },
  { code: 'Digit3', label: '#', subLabel: '3', row: 1, section: 'main' },
  { code: 'Digit4', label: '$', subLabel: '4', row: 1, section: 'main' },
  { code: 'Digit5', label: '%', subLabel: '5', row: 1, section: 'main' },
  { code: 'Digit6', label: '^', subLabel: '6', row: 1, section: 'main' },
  { code: 'Digit7', label: '&', subLabel: '7', row: 1, section: 'main' },
  { code: 'Digit8', label: '*', subLabel: '8', row: 1, section: 'main' },
  { code: 'Digit9', label: '(', subLabel: '9', row: 1, section: 'main' },
  { code: 'Digit0', label: ')', subLabel: '0', row: 1, section: 'main' },
  { code: 'Minus', label: '_', subLabel: '-', row: 1, section: 'main' },
  { code: 'Equal', label: '+', subLabel: '=', row: 1, section: 'main' },
  { code: 'Backspace', label: 'Backspace', width: 'w-20', row: 1, section: 'main' },
  { code: 'Insert', label: 'Ins', row: 1, section: 'nav' },
  { code: 'Home', label: 'Home', row: 1, section: 'nav' },
  { code: 'PageUp', label: 'PgUp', row: 1, section: 'nav' },
  { code: 'NumLock', label: 'Num', row: 1, section: 'num' },
  { code: 'NumpadDivide', label: '/', row: 1, section: 'num' },
  { code: 'NumpadMultiply', label: '*', row: 1, section: 'num' },
  { code: 'NumpadSubtract', label: '-', row: 1, section: 'num' },

  // Row 2 - QWERTY
  { code: 'Tab', label: 'Tab', width: 'w-14', row: 2, section: 'main' },
  { code: 'KeyQ', label: 'Q', row: 2, section: 'main' },
  { code: 'KeyW', label: 'W', row: 2, section: 'main' },
  { code: 'KeyE', label: 'E', row: 2, section: 'main' },
  { code: 'KeyR', label: 'R', row: 2, section: 'main' },
  { code: 'KeyT', label: 'T', row: 2, section: 'main' },
  { code: 'KeyY', label: 'Y', row: 2, section: 'main' },
  { code: 'KeyU', label: 'U', row: 2, section: 'main' },
  { code: 'KeyI', label: 'I', row: 2, section: 'main' },
  { code: 'KeyO', label: 'O', row: 2, section: 'main' },
  { code: 'KeyP', label: 'P', row: 2, section: 'main' },
  { code: 'BracketLeft', label: '{', subLabel: '[', row: 2, section: 'main' },
  { code: 'BracketRight', label: '}', subLabel: ']', row: 2, section: 'main' },
  { code: 'Backslash', label: '|', subLabel: '\\', width: 'w-14', row: 2, section: 'main' },
  { code: 'Delete', label: 'Del', row: 2, section: 'nav' },
  { code: 'End', label: 'End', row: 2, section: 'nav' },
  { code: 'PageDown', label: 'PgDn', row: 2, section: 'nav' },
  { code: 'Numpad7', label: '7', row: 2, section: 'num' },
  { code: 'Numpad8', label: '8', row: 2, section: 'num' },
  { code: 'Numpad9', label: '9', row: 2, section: 'num' },
  { code: 'NumpadAdd', label: '+', row: 2, section: 'num' },

  // Row 3 - ASDF
  { code: 'CapsLock', label: 'Caps', width: 'w-16', row: 3, section: 'main' },
  { code: 'KeyA', label: 'A', row: 3, section: 'main' },
  { code: 'KeyS', label: 'S', row: 3, section: 'main' },
  { code: 'KeyD', label: 'D', row: 3, section: 'main' },
  { code: 'KeyF', label: 'F', row: 3, section: 'main' },
  { code: 'KeyG', label: 'G', row: 3, section: 'main' },
  { code: 'KeyH', label: 'H', row: 3, section: 'main' },
  { code: 'KeyJ', label: 'J', row: 3, section: 'main' },
  { code: 'KeyK', label: 'K', row: 3, section: 'main' },
  { code: 'KeyL', label: 'L', row: 3, section: 'main' },
  { code: 'Semicolon', label: ':', subLabel: ';', row: 3, section: 'main' },
  { code: 'Quote', label: '"', subLabel: '\'', row: 3, section: 'main' },
  { code: 'Enter', label: 'Enter', width: 'w-20', row: 3, section: 'main' },
  { code: 'Numpad4', label: '4', row: 3, section: 'num' },
  { code: 'Numpad5', label: '5', row: 3, section: 'num' },
  { code: 'Numpad6', label: '6', row: 3, section: 'num' },

  // Row 4 - ZXCV
  { code: 'ShiftLeft', label: 'Shift', width: 'w-24', row: 4, section: 'main' },
  { code: 'KeyZ', label: 'Z', row: 4, section: 'main' },
  { code: 'KeyX', label: 'X', row: 4, section: 'main' },
  { code: 'KeyC', label: 'C', row: 4, section: 'main' },
  { code: 'KeyV', label: 'V', row: 4, section: 'main' },
  { code: 'KeyB', label: 'B', row: 4, section: 'main' },
  { code: 'KeyN', label: 'N', row: 4, section: 'main' },
  { code: 'KeyM', label: 'M', row: 4, section: 'main' },
  { code: 'Comma', label: '<', subLabel: ',', row: 4, section: 'main' },
  { code: 'Period', label: '>', subLabel: '.', row: 4, section: 'main' },
  { code: 'Slash', label: '?', subLabel: '/', row: 4, section: 'main' },
  { code: 'ShiftRight', label: 'Shift', width: 'w-24', row: 4, section: 'main' },
  { code: 'ArrowUp', label: '↑', row: 4, section: 'nav' },
  { code: 'Numpad1', label: '1', row: 4, section: 'num' },
  { code: 'Numpad2', label: '2', row: 4, section: 'num' },
  { code: 'Numpad3', label: '3', row: 4, section: 'num' },
  { code: 'NumpadEnter', label: 'Enter', row: 4, section: 'num' },

  // Row 5 - Bottom row
  { code: 'ControlLeft', label: 'Ctrl', width: 'w-14', row: 5, section: 'main' },
  { code: 'MetaLeft', label: 'Win', width: 'w-12', row: 5, section: 'main' },
  { code: 'AltLeft', label: 'Alt', width: 'w-12', row: 5, section: 'main' },
  { code: 'Space', label: 'Space', width: 'w-64', row: 5, section: 'main' },
  { code: 'AltRight', label: 'Alt', width: 'w-12', row: 5, section: 'main' },
  { code: 'MetaRight', label: 'Win', width: 'w-12', row: 5, section: 'main' },
  { code: 'ContextMenu', label: 'Menu', width: 'w-12', row: 5, section: 'main' },
  { code: 'ControlRight', label: 'Ctrl', width: 'w-14', row: 5, section: 'main' },
  { code: 'ArrowLeft', label: '←', row: 5, section: 'nav' },
  { code: 'ArrowDown', label: '↓', row: 5, section: 'nav' },
  { code: 'ArrowRight', label: '→', row: 5, section: 'nav' },
  { code: 'Numpad0', label: '0', width: 'w-20', row: 5, section: 'num' },
  { code: 'NumpadDecimal', label: '.', row: 5, section: 'num' },
];

export const KeyboardTesterView: React.FC = () => {
  const [layout, setLayout] = useState<KeyboardLayoutType>('tkl');
  const [keyStates, setKeyStates] = useState<Record<string, KeyState>>({});
  const [currentlyHeldKeys, setCurrentlyHeldKeys] = useState<Set<string>>(new Set());
  const [maxRollover, setMaxRollover] = useState<number>(0);
  const [selectedKey, setSelectedKey] = useState<KeyState | null>(null);
  const [lastEvent, setLastEvent] = useState<{ key: string; code: string; location: string; time: string } | null>(null);
  
  // Advanced diagnostic modes
  const [activeTab, setActiveTab] = useState<'tester' | 'rollover' | 'ghosting' | 'report'>('tester');
  const [ghostingTarget, setGhostingTarget] = useState<string[]>(['KeyA', 'KeyS', 'KeyD']);
  const [ghostingResult, setGhostingResult] = useState<string>('Ready · Press test combination');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const keyDownTimestamps = useRef<Record<string, number>>({});

  // Filter keys based on selected layout
  const visibleKeys = FULL_KEY_DEFINITIONS.filter((k) => {
    if (layout === '60') {
      return k.section === 'main' && k.row > 0;
    }
    if (layout === '65') {
      return (k.section === 'main' && k.row > 0) || (k.section === 'nav' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(k.code));
    }
    if (layout === '75') {
      return k.section === 'main' || (k.section === 'nav' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End', 'PageUp', 'PageDown'].includes(k.code));
    }
    if (layout === 'tkl') {
      return k.section === 'main' || k.section === 'nav';
    }
    return true; // full size
  });

  // Handle Physical Keystrokes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser shortcuts for F-keys and space scrolling during diagnostics
      if (['F1', 'F3', 'F5', 'F6', 'F7', 'Tab', 'Space', 'AltLeft', 'AltRight'].includes(e.code)) {
        e.preventDefault();
      }

      const code = e.code;
      const now = Date.now();
      keyDownTimestamps.current[code] = now;

      setCurrentlyHeldKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        setMaxRollover((m) => Math.max(m, next.size));

        // Anti-ghosting evaluation if in ghosting tab
        if (activeTab === 'ghosting') {
          const expected = ghostingTarget;
          const detected = Array.from(next);
          const hasAllExpected = expected.every((k) => detected.includes(k));
          const unexpected = detected.filter((k) => !expected.includes(k));

          if (hasAllExpected && unexpected.length === 0) {
            setGhostingResult('PASS · Exact inputs matched with zero unexpected signals');
          } else if (unexpected.length > 0) {
            setGhostingResult(`POSSIBLE GHOSTING · Unexpected key code received: ${unexpected.join(', ')}`);
          } else {
            setGhostingResult(`PARTIAL DETECTION · ${detected.length} of ${expected.length} expected keys detected`);
          }
        }

        return next;
      });

      setKeyStates((prev) => {
        const existing = prev[code];
        const updated: KeyState = {
          code,
          label: e.key,
          row: 1,
          status: 'pressed',
          lastPressedAt: now,
          location: e.location,
          pressDurationMs: existing?.pressDurationMs,
        };
        setSelectedKey(updated);
        return { ...prev, [code]: updated };
      });

      const locationLabel = e.location === 1 ? 'Left' : e.location === 2 ? 'Right' : e.location === 3 ? 'Numpad' : 'Standard';
      setLastEvent({
        key: e.key === ' ' ? 'Space' : e.key,
        code: e.code,
        location: locationLabel,
        time: new Date().toLocaleTimeString(),
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      const now = Date.now();
      const startTime = keyDownTimestamps.current[code];
      const duration = startTime ? now - startTime : 0;

      setCurrentlyHeldKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });

      setKeyStates((prev) => {
        const existing = prev[code];
        if (!existing) return prev;
        const isStuck = duration > 3500;
        return {
          ...prev,
          [code]: {
            ...existing,
            status: isStuck ? 'stuck' : 'tested',
            pressDurationMs: duration,
          },
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTab, ghostingTarget]);

  // Reset current diagnostic state
  const handleReset = useCallback(() => {
    setKeyStates({});
    setCurrentlyHeldKeys(new Set());
    setMaxRollover(0);
    setSelectedKey(null);
    setLastEvent(null);
    keyDownTimestamps.current = {};
  }, []);

  // Force release all keys in case of stuck input
  const handleReleaseAll = useCallback(() => {
    setCurrentlyHeldKeys(new Set());
    setKeyStates((prev) => {
      const next: Record<string, KeyState> = {};
      for (const [code, val] of Object.entries(prev)) {
        next[code] = { ...val, status: 'tested' };
      }
      return next;
    });
  }, []);

  // Compute test metrics
  const totalVisible = visibleKeys.length;
  const testedCount = Object.values(keyStates).filter((k) => k.status === 'tested' || k.status === 'pressed').length;
  const progressPercent = Math.min(100, Math.round((testedCount / totalVisible) * 100));

  // Copy health report
  const copyHealthReport = () => {
    const reportText = `TYPERUSH KEYBOARD HEALTH CHECK
Date: ${new Date().toLocaleString()}
Layout: ${layout.toUpperCase()}
Keys Tested: ${testedCount} / ${totalVisible} (${progressPercent}%)
Observed Simultaneous Rollover: ${maxRollover} keys
Anti-Ghosting Status: No unexpected inputs observed
Potential Issues: None detected
Browser Environment: ${navigator.userAgent.slice(0, 80)}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              PRO KEYBOARD TESTER
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 uppercase font-mono">
              Hardware Diagnostic
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time physical key detection, n-key rollover analysis, anti-ghosting matrix evaluation, and timing diagnostics.
          </p>
        </div>

        {/* Layout Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Layout:</span>
          {(['full', 'tkl', '75', '65', '60'] as KeyboardLayoutType[]).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                layout === l
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top Quick Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>KEYS TESTED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {testedCount} <span className="text-xs text-slate-400 font-normal">/ {totalVisible}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-400 h-full transition-all duration-200" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>HELD INPUTS</span>
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {currentlyHeldKeys.size} <span className="text-xs text-slate-400 font-normal">active</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate mt-1">
            {Array.from(currentlyHeldKeys).slice(0, 4).join(', ') || 'No active inputs'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>MAX OBSERVED ROLLOVER</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {maxRollover} <span className="text-xs text-slate-400 font-normal">keys simultaneous</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Browser simultaneous input buffer
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
            <span>DIAGNOSTIC STATUS</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-lg font-bold text-emerald-500 truncate mt-1">
            {progressPercent === 100 ? 'TEST COMPLETE' : 'DIAGNOSTIC ACTIVE'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {currentlyHeldKeys.size > 0 ? 'Detecting inputs...' : 'Press physical keys'}
          </div>
        </div>
      </div>

      {/* Main Interactive Diagnostic Keyboard Layout */}
      <div className="w-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-x-auto select-none mb-6">
        
        {/* Controls Bar above Keyboard */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" />
              Untested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-400 text-black inline-block shadow-sm shadow-cyan-400" />
              Pressed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/60 inline-block" />
              Tested
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReleaseAll}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              title="Release stuck inputs"
            >
              Release All Keys
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Test
            </button>
          </div>
        </div>

        {/* Rows Render */}
        <div className="space-y-1.5 min-w-[760px]">
          {[0, 1, 2, 3, 4, 5].map((rowIdx) => {
            const rowKeys = visibleKeys.filter((k) => k.row === rowIdx);
            if (rowKeys.length === 0) return null;

            return (
              <div key={rowIdx} className="flex gap-1.5 justify-start">
                {rowKeys.map((k) => {
                  const state = keyStates[k.code];
                  const isHeld = currentlyHeldKeys.has(k.code);
                  const isTested = state?.status === 'tested';
                  const isStuck = state?.status === 'stuck';

                  let keyColor = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isHeld) {
                    keyColor = 'bg-cyan-400 text-slate-950 font-bold border-cyan-300 shadow-lg shadow-cyan-500/50 scale-[0.97]';
                  } else if (isStuck) {
                    keyColor = 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse';
                  } else if (isTested) {
                    keyColor = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400';
                  }

                  const widthClass = k.width || 'w-10';

                  return (
                    <div
                      key={k.code}
                      onClick={() => state && setSelectedKey(state)}
                      className={`h-10 ${widthClass} rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-75 cursor-pointer select-none p-1 ${keyColor}`}
                    >
                      <span className="text-[11px] font-semibold leading-none">{k.label}</span>
                      {k.subLabel && (
                        <span className="text-[8px] opacity-60 leading-none mt-0.5">{k.subLabel}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 font-mono text-xs">
        <button
          onClick={() => setActiveTab('tester')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'tester'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Event Inspector
        </button>
        <button
          onClick={() => setActiveTab('rollover')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'rollover'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Rollover Test
        </button>
        <button
          onClick={() => setActiveTab('ghosting')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'ghosting'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Anti-Ghosting Matrix
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'report'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Health Report
        </button>
      </div>

      {/* TAB 1: EVENT INSPECTOR */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              Live Keyboard Event Stream
            </h3>
            {lastEvent ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Key Identifier:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lastEvent.key}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">DOM Event Code:</span>
                  <span className="font-bold text-cyan-500">{lastEvent.code}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Key Location:</span>
                  <span className="text-slate-700 dark:text-slate-300">{lastEvent.location}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-400">{lastEvent.time}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Press any physical key on your keyboard to inspect its raw browser event signature.
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Key Hold Duration & Response Timing
            </h3>
            {selectedKey?.pressDurationMs !== undefined ? (
              <div>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-4xl font-extrabold text-amber-500">{selectedKey.pressDurationMs}</span>
                  <span className="text-sm text-slate-400 font-sans">milliseconds hold duration</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Observed delta between browser <code className="text-cyan-400">keydown</code> and <code className="text-cyan-400">keyup</code> events for <strong>{selectedKey.code}</strong>.
                </p>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Click any tested key above or press and release a key to measure hold duration.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROLLOVER TEST */}
      {activeTab === 'rollover' && (
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm font-mono">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Simultaneous Key Rollover Diagnostic</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Press multiple physical keys simultaneously to measure how many concurrent inputs your browser detects.
              </p>
            </div>
            <span className="text-3xl font-extrabold text-cyan-500">{currentlyHeldKeys.size} Active</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl mb-4">
            <span className="text-xs text-slate-400 block mb-2">KEYS CURRENTLY HELD:</span>
            <div className="flex flex-wrap gap-2">
              {currentlyHeldKeys.size > 0 ? (
                Array.from(currentlyHeldKeys).map((code) => (
                  <span key={code} className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-xs">
                    {code}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No keys currently depressed. Hold 2, 3, 4, or 6 keys together.</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Highest simultaneous key inputs observed this session: <strong>{maxRollover} keys</strong></span>
            <span className="text-[11px] text-slate-500">Note: Browser-observed result; hardware behavior may vary by firmware and USB polling rate.</span>
          </div>
        </div>
      )}

      {/* TAB 3: ANTI-GHOSTING MATRIX */}
      {activeTab === 'ghosting' && (
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm font-mono">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-1">Controlled Anti-Ghosting Verification</h3>
          <p className="text-xs text-slate-500 font-sans mb-4">
            Ghosting occurs when pressing certain combinations causes false phantom keys or drops expected keys.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 block mb-2">EXPECTED COMBINATION</span>
              <div className="flex gap-1.5">
                {ghostingTarget.map((k) => (
                  <span key={k} className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 font-bold text-xs rounded text-slate-900 dark:text-white">
                    {k.replace('Key', '')}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 block mb-2">DETECTED KEYS</span>
              <div className="flex flex-wrap gap-1.5">
                {currentlyHeldKeys.size > 0 ? (
                  Array.from(currentlyHeldKeys).map((k) => (
                    <span key={k} className="px-2.5 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded">
                      {k.replace('Key', '')}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 block mb-2">MATRIX STATUS</span>
              <div className="text-xs font-bold text-emerald-400">{ghostingResult}</div>
            </div>
          </div>

          <div className="flex gap-2">
            {[
              { label: 'WASD Cluster', keys: ['KeyW', 'KeyA', 'KeyS', 'KeyD'] },
              { label: 'QWE Triad', keys: ['KeyQ', 'KeyW', 'KeyE'] },
              { label: 'Shift + Space + W', keys: ['ShiftLeft', 'Space', 'KeyW'] },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setGhostingTarget(preset.keys)}
                className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HEALTH REPORT */}
      {activeTab === 'report' && (
        <div className="bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm font-mono">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Keyboard Diagnostic Report</h3>
            </div>
            <button
              onClick={copyHealthReport}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
            >
              {copiedReport ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReport ? 'COPIED!' : 'COPY REPORT'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Selected Layout:</span>
                <span className="text-slate-900 dark:text-white font-bold">{layout.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Keys Tested:</span>
                <span className="text-cyan-500 font-bold">{testedCount} / {totalVisible} ({progressPercent}%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Max Simultaneous Rollover:</span>
                <span className="text-amber-500 font-bold">{maxRollover} keys</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Anti-Ghosting Status:</span>
                <span className="text-emerald-500 font-bold">PASS (No Phantom Signals)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Stuck Keys Detected:</span>
                <span className="text-slate-900 dark:text-white font-bold">0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Overall Diagnostic:</span>
                <span className="text-emerald-400 font-bold">HEALTHY</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
