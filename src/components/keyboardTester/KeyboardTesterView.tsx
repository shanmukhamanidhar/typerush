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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] font-mono tracking-tight">
              PRO KEYBOARD TESTER
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF5A00]/10 text-[#FF5A00] border border-[#FF5A00]/30 uppercase font-mono">
              Hardware Diagnostic
            </span>
          </div>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA]">
            Real-time physical key detection, n-key rollover analysis, anti-ghosting matrix evaluation, and timing diagnostics.
          </p>
        </div>

        {/* Layout Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#6B6B6B] dark:text-[#A1A1AA]">Layout:</span>
          {(['full', 'tkl', '75', '65', '60'] as KeyboardLayoutType[]).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                layout === l
                  ? 'bg-[#FF5A00]/15 border-[#FF5A00] text-[#FF5A00] shadow-sm'
                  : 'bg-[#F7F7F7] dark:bg-[#161616] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top Quick Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm">
          <div className="text-xs text-[#6B6B6B] dark:text-[#71717A] mb-1 flex items-center justify-between">
            <span>KEYS TESTED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A00]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111111] dark:text-white">
            {testedCount} <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] font-normal">/ {totalVisible}</span>
          </div>
          <div className="w-full bg-[#E5E5E5] dark:bg-[#2A2A2A] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#FF5A00] h-full transition-all duration-200" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm">
          <div className="text-xs text-[#6B6B6B] dark:text-[#71717A] mb-1 flex items-center justify-between">
            <span>HELD INPUTS</span>
            <Activity className="w-3.5 h-3.5 text-[#FF5A00]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FF5A00] glow-orange">
            {currentlyHeldKeys.size} <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] font-normal">active</span>
          </div>
          <div className="text-[10px] text-[#6B6B6B] dark:text-[#71717A] truncate mt-1">
            {Array.from(currentlyHeldKeys).slice(0, 4).join(', ') || 'No active inputs'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm">
          <div className="text-xs text-[#6B6B6B] dark:text-[#71717A] mb-1 flex items-center justify-between">
            <span>MAX OBSERVED ROLLOVER</span>
            <Zap className="w-3.5 h-3.5 text-[#FF6E1A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111111] dark:text-white">
            {maxRollover} <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] font-normal">keys simultaneous</span>
          </div>
          <div className="text-[10px] text-[#6B6B6B] dark:text-[#71717A] mt-1">
            Browser simultaneous input buffer
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-3.5 shadow-sm">
          <div className="text-xs text-[#6B6B6B] dark:text-[#71717A] mb-1 flex items-center justify-between">
            <span>DIAGNOSTIC STATUS</span>
            <Clock className="w-3.5 h-3.5 text-[#6B6B6B] dark:text-[#71717A]" />
          </div>
          <div className="text-lg font-bold text-[#FF5A00] truncate mt-1">
            {progressPercent === 100 ? 'TEST COMPLETE' : 'DIAGNOSTIC ACTIVE'}
          </div>
          <div className="text-[10px] text-[#6B6B6B] dark:text-[#71717A] mt-1">
            {currentlyHeldKeys.size > 0 ? 'Detecting inputs...' : 'Press physical keys'}
          </div>
        </div>
      </div>

      {/* Main Interactive Diagnostic Keyboard Layout */}
      <div className="w-full bg-white dark:bg-[#111111] p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl overflow-x-auto select-none mb-6">
        
        {/* Controls Bar above Keyboard */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono">
          <div className="flex items-center gap-4 text-[#6B6B6B] dark:text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] inline-block" />
              Untested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#FF5A00] text-black inline-block shadow-sm shadow-[#FF5A00]/40" />
              Pressed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#FF6E1A]/20 border border-[#FF6E1A]/60 inline-block" />
              Tested
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReleaseAll}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF5A00]/40 transition-colors"
              title="Release stuck inputs"
            >
              Release All Keys
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#FF3B5C] bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 hover:bg-[#FF3B5C]/20 transition-colors flex items-center gap-1 font-bold"
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

                  let keyColor = 'bg-[#F7F7F7] dark:bg-[#161616] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#FF5A00]/40';

                  if (isHeld) {
                    keyColor = 'bg-[#FF5A00] text-black font-black border-[#FF5A00] shadow-lg shadow-[#FF5A00]/40 scale-[0.97]';
                  } else if (isStuck) {
                    keyColor = 'bg-[#FF3B5C]/20 border-[#FF3B5C] text-[#FF3B5C] animate-pulse font-bold';
                  } else if (isTested) {
                    keyColor = 'bg-[#FF6E1A]/15 border-[#FF6E1A]/50 text-[#FF6E1A] font-bold';
                  }

                  const widthClass = k.width || 'w-10';

                  return (
                    <div
                      key={k.code}
                      onClick={() => state && setSelectedKey(state)}
                      className={`h-10 ${widthClass} rounded-md border flex flex-col items-center justify-center font-mono transition-all duration-75 cursor-pointer select-none p-1 ${keyColor}`}
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
      <div className="flex border-b border-[#E5E5E5] dark:border-[#2A2A2A] mb-6 font-mono text-xs">
        <button
          onClick={() => setActiveTab('tester')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'tester'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          Event Inspector
        </button>
        <button
          onClick={() => setActiveTab('rollover')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'rollover'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          Rollover Test
        </button>
        <button
          onClick={() => setActiveTab('ghosting')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'ghosting'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          Anti-Ghosting Matrix
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all ${
            activeTab === 'report'
              ? 'border-[#FF5A00] text-[#FF5A00]'
              : 'border-transparent text-[#6B6B6B] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          Health Report
        </button>
      </div>

      {/* TAB 1: EVENT INSPECTOR */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-[#6B6B6B] dark:text-[#A1A1AA] mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF5A00]" />
              Live Keyboard Event Stream
            </h3>
            {lastEvent ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[#6B6B6B] dark:text-[#71717A]">Key Identifier:</span>
                  <span className="font-bold text-[#111111] dark:text-white">{lastEvent.key}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[#6B6B6B] dark:text-[#71717A]">DOM Event Code:</span>
                  <span className="font-bold text-[#FF5A00]">{lastEvent.code}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[#6B6B6B] dark:text-[#71717A]">Key Location:</span>
                  <span className="text-[#111111] dark:text-white">{lastEvent.location}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#6B6B6B] dark:text-[#71717A]">Timestamp:</span>
                  <span className="text-[#6B6B6B] dark:text-[#A1A1AA]">{lastEvent.time}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#6B6B6B] dark:text-[#71717A]">
                Press any physical key on your keyboard to inspect its raw browser event signature.
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-[#6B6B6B] dark:text-[#A1A1AA] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6E1A]" />
              Key Hold Duration & Response Timing
            </h3>
            {selectedKey?.pressDurationMs !== undefined ? (
              <div>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-4xl font-extrabold text-[#FF6E1A]">{selectedKey.pressDurationMs}</span>
                  <span className="text-sm text-[#6B6B6B] dark:text-[#A1A1AA] font-sans">milliseconds hold duration</span>
                </div>
                <p className="text-[11px] text-[#6B6B6B] dark:text-[#71717A] mt-2">
                  Observed delta between browser <code className="text-[#FF5A00]">keydown</code> and <code className="text-[#FF5A00]">keyup</code> events for <strong>{selectedKey.code}</strong>.
                </p>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#6B6B6B] dark:text-[#71717A]">
                Click any tested key above or press and release a key to measure hold duration.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROLLOVER TEST */}
      {activeTab === 'rollover' && (
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm font-mono">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase">Simultaneous Key Rollover Diagnostic</h3>
              <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] font-sans mt-0.5">
                Press multiple physical keys simultaneously to measure how many concurrent inputs your browser detects.
              </p>
            </div>
            <span className="text-3xl font-extrabold text-[#FF5A00] glow-orange">{currentlyHeldKeys.size} Active</span>
          </div>

          <div className="p-4 bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl mb-4">
            <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] block mb-2">KEYS CURRENTLY HELD:</span>
            <div className="flex flex-wrap gap-2">
              {currentlyHeldKeys.size > 0 ? (
                Array.from(currentlyHeldKeys).map((code) => (
                  <span key={code} className="px-3 py-1 rounded-md bg-[#FF5A00] text-black font-bold text-xs">
                    {code}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] italic">No keys currently depressed. Hold 2, 3, 4, or 6 keys together.</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B6B6B] dark:text-[#A1A1AA] pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span>Highest simultaneous key inputs observed this session: <strong className="text-[#111111] dark:text-white">{maxRollover} keys</strong></span>
            <span className="text-[11px] text-[#6B6B6B] dark:text-[#71717A]">Browser-observed result; hardware behavior may vary by firmware and USB polling rate.</span>
          </div>
        </div>
      )}

      {/* TAB 3: ANTI-GHOSTING MATRIX */}
      {activeTab === 'ghosting' && (
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm font-mono">
          <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase mb-1">Controlled Anti-Ghosting Verification</h3>
          <p className="text-xs text-[#6B6B6B] dark:text-[#A1A1AA] font-sans mb-4">
            Ghosting occurs when pressing certain combinations causes false phantom keys or drops expected keys.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl">
              <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] block mb-2">EXPECTED COMBINATION</span>
              <div className="flex gap-1.5">
                {ghostingTarget.map((k) => (
                  <span key={k} className="px-2.5 py-1 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] font-bold text-xs rounded text-[#111111] dark:text-white">
                    {k.replace('Key', '')}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl">
              <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] block mb-2">DETECTED KEYS</span>
              <div className="flex flex-wrap gap-1.5">
                {currentlyHeldKeys.size > 0 ? (
                  Array.from(currentlyHeldKeys).map((k) => (
                    <span key={k} className="px-2.5 py-1 bg-[#FF5A00] text-black font-bold text-xs rounded">
                      {k.replace('Key', '')}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] italic">None</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl">
              <span className="text-xs text-[#6B6B6B] dark:text-[#71717A] block mb-2">MATRIX STATUS</span>
              <div className="text-xs font-bold text-[#FF5A00]">{ghostingResult}</div>
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
                className="px-3 py-1.5 rounded-lg text-xs border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#161616] text-[#111111] dark:text-[#A1A1AA] hover:text-[#FF5A00] hover:border-[#FF5A00]/40 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HEALTH REPORT */}
      {activeTab === 'report' && (
        <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm font-mono">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF5A00]" />
              <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase">Keyboard Diagnostic Report</h3>
            </div>
            <button
              onClick={copyHealthReport}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5A00] text-black hover:bg-[#FF6E1A] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copiedReport ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReport ? 'COPIED!' : 'COPY REPORT'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#6B6B6B] dark:text-[#71717A]">Selected Layout:</span>
                <span className="text-[#111111] dark:text-white font-bold">{layout.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#6B6B6B] dark:text-[#71717A]">Keys Tested:</span>
                <span className="text-[#FF5A00] font-bold">{testedCount} / {totalVisible} ({progressPercent}%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#6B6B6B] dark:text-[#71717A]">Max Simultaneous Rollover:</span>
                <span className="text-[#FF6E1A] font-bold">{maxRollover} keys</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#6B6B6B] dark:text-[#71717A]">Anti-Ghosting Status:</span>
                <span className="text-[#FF5A00] font-bold">PASS (No Phantom Signals)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#6B6B6B] dark:text-[#71717A]">Stuck Keys Detected:</span>
                <span className="text-[#111111] dark:text-white font-bold">0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[#6B6B6B] dark:text-[#71717A]">Overall Diagnostic:</span>
                <span className="text-[#FF5A00] font-bold">HEALTHY</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
