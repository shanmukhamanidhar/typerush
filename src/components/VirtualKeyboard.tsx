import React from 'react';
import { KeymapLayout, KeymapMode } from '../types/typing';

interface VirtualKeyboardProps {
  activeKey: string | null;
  isKeyError: boolean;
  expectedChar: string;
  layout?: KeymapLayout;
  keymapMode?: KeymapMode;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  isKeyError,
  expectedChar,
  layout = 'qwerty',
  keymapMode = 'reactive',
}) => {
  if (keymapMode === 'off') return null;

  // Normalize comparison
  const normalizedActive = activeKey ? activeKey.toUpperCase() : null;
  const normalizedExpected = expectedChar ? (expectedChar === ' ' ? 'SPACE' : expectedChar.toUpperCase()) : null;

  // Keyboard Layout Maps
  const LAYOUTS: Record<KeymapLayout, { row1: string[]; row2: string[]; row3: string[] }> = {
    qwerty: {
      row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    },
    qwertz: {
      row1: ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
    },
    azerty: {
      row1: ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2: ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      row3: ['W', 'X', 'C', 'V', 'B', 'N'],
    },
    dvorak: {
      row1: ["'", ',', '.', 'P', 'Y', 'F', 'G', 'C', 'R', 'L'],
      row2: ['A', 'O', 'E', 'U', 'I', 'D', 'H', 'T', 'N', 'S'],
      row3: [';', 'Q', 'J', 'K', 'X', 'B', 'M', 'W', 'V', 'Z'],
    },
    colemak: {
      row1: ['Q', 'W', 'F', 'P', 'G', 'J', 'L', 'U', 'Y', ';'],
      row2: ['A', 'R', 'S', 'T', 'D', 'H', 'N', 'E', 'I', 'O'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'K', 'M'],
    },
  };

  const currentLayout = LAYOUTS[layout] || LAYOUTS.qwerty;

  const getKeyClass = (key: string, isSpecial: boolean = false) => {
    const isPressed = normalizedActive === key || (key === 'SPACE' && activeKey === ' ');
    const isTarget = keymapMode === 'next-key' && normalizedExpected === key;

    let base = 'relative flex items-center justify-center font-mono font-medium rounded-md transition-all duration-100 select-none ';

    if (isSpecial) {
      base += 'text-[11px] sm:text-xs text-[#666666] dark:text-[#777777] ';
    } else {
      base += 'text-xs sm:text-sm font-semibold text-[#111111] dark:text-white ';
    }

    if (isPressed) {
      if (isKeyError) {
        return base + 'bg-[#FF3B5C] text-white scale-95 shadow-[0_0_12px_rgba(255,59,92,0.4)] border border-[#FF3B5C]';
      }
      return base + 'bg-[#FF5A00] text-black scale-95 shadow-[0_0_12px_rgba(255,90,0,0.4)] border border-[#FF5A00] font-black';
    }

    if (isTarget) {
      return base + 'bg-[#FF6E1A]/20 border-2 border-[#FF6E1A] text-[#FF6E1A] shadow-[0_0_10px_rgba(255,122,24,0.3)] animate-pulse';
    }

    return base + 'bg-[#F7F7F7] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs hover:border-[#FF5A00]/30';
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-md dark:shadow-none select-none transition-colors">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        
        {/* ROW 1 */}
        <div className="flex justify-center gap-1 sm:gap-1.5">
          {currentLayout.row1.map((key) => (
            <div
              key={key}
              className={`w-7 sm:w-11 h-9 sm:h-11 ${getKeyClass(key)}`}
            >
              {key}
            </div>
          ))}
          <div className={`w-12 sm:w-16 h-9 sm:h-11 ${getKeyClass('BACKSPACE', true)}`}>
            Bksp
          </div>
        </div>

        {/* ROW 2 */}
        <div className="flex justify-center gap-1 sm:gap-1.5">
          <div className={`w-10 sm:w-14 h-9 sm:h-11 ${getKeyClass('CAPS', true)}`}>
            Caps
          </div>
          {currentLayout.row2.map((key) => (
            <div
              key={key}
              className={`w-7 sm:w-11 h-9 sm:h-11 ${getKeyClass(key)}`}
            >
              {key}
            </div>
          ))}
          <div className={`w-12 sm:w-16 h-9 sm:h-11 ${getKeyClass('ENTER', true)}`}>
            Enter
          </div>
        </div>

        {/* ROW 3 */}
        <div className="flex justify-center gap-1 sm:gap-1.5">
          <div className={`w-12 sm:w-16 h-9 sm:h-11 ${getKeyClass('SHIFT', true)}`}>
            Shift
          </div>
          {currentLayout.row3.map((key) => (
            <div
              key={key}
              className={`w-7 sm:w-11 h-9 sm:h-11 ${getKeyClass(key)}`}
            >
              {key}
            </div>
          ))}
          <div className={`w-12 sm:w-16 h-9 sm:h-11 ${getKeyClass('SHIFT', true)}`}>
            Shift
          </div>
        </div>

        {/* ROW 4: Modifiers & Space */}
        <div className="flex justify-center gap-1 sm:gap-1.5">
          <div className={`w-10 sm:w-14 h-9 sm:h-11 ${getKeyClass('CTRL', true)}`}>
            Ctrl
          </div>
          <div className={`w-10 sm:w-14 h-9 sm:h-11 ${getKeyClass('ALT', true)}`}>
            Alt
          </div>
          <div className={`w-44 sm:w-72 h-9 sm:h-11 ${getKeyClass('SPACE')}`}>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              {normalizedExpected === 'SPACE' ? '• SPACE •' : 'SPACE'}
            </span>
          </div>
          <div className={`w-10 sm:w-14 h-9 sm:h-11 ${getKeyClass('ALT', true)}`}>
            Alt
          </div>
          <div className={`w-10 sm:w-14 h-9 sm:h-11 ${getKeyClass('CTRL', true)}`}>
            Ctrl
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between text-[11px] text-[#666666] dark:text-[#A1A1AA] mt-3 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A] font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF5A00] shadow-[0_0_6px_#FF5A00] inline-block" />
          <span className="uppercase tracking-wider">{layout} · {keymapMode === 'next-key' ? 'Next-Key Guide' : 'Reactive'}</span>
        </span>
        <span className="hidden sm:inline text-[#FF5A00] font-bold">
          {expectedChar ? (expectedChar === ' ' ? 'Next: [Space]' : `Next: "${expectedChar}"`) : 'Ready'}
        </span>
      </div>
    </div>
  );
};
