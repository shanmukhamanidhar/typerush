import React from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  isKeyError: boolean;
  expectedChar: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  isKeyError,
  expectedChar,
}) => {
  // Normalize comparison
  const normalizedActive = activeKey ? activeKey.toUpperCase() : null;
  const normalizedExpected = expectedChar ? (expectedChar === ' ' ? 'SPACE' : expectedChar.toUpperCase()) : null;

  // Keyboard Rows
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const getKeyClass = (key: string, isSpecial: boolean = false) => {
    const isPressed = normalizedActive === key || (key === 'SPACE' && activeKey === ' ');
    const isTarget = normalizedExpected === key;

    let base = 'relative flex items-center justify-center font-mono font-medium rounded-lg transition-all duration-100 select-none ';

    if (isSpecial) {
      base += 'text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 ';
    } else {
      base += 'text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 ';
    }

    if (isPressed) {
      if (isKeyError) {
        return base + 'bg-rose-500 text-white scale-95 shadow-md shadow-rose-500/50 border border-rose-400';
      }
      return base + 'bg-cyan-500 text-slate-950 scale-95 shadow-md shadow-cyan-500/50 border border-cyan-400';
    }

    if (isTarget) {
      return base + 'bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/70 text-cyan-600 dark:text-cyan-400 shadow-sm shadow-cyan-500/20';
    }

    return base + 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:border-slate-300 dark:hover:border-slate-600';
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 sm:p-5 rounded-2xl bg-slate-100/80 dark:bg-[#0c1220]/90 border border-slate-200 dark:border-slate-800/80 shadow-inner backdrop-blur-sm select-none transition-colors">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        
        {/* ROW 1 */}
        <div className="flex justify-center gap-1 sm:gap-1.5">
          {row1.map((key) => (
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
          {row2.map((key) => (
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
          {row3.map((key) => (
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

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 inline-block" />
          <span>Real-time keystroke visualizer</span>
        </span>
        <span className="hidden sm:inline">
          {expectedChar ? (expectedChar === ' ' ? 'Next: [Space]' : `Next: "${expectedChar}"`) : 'Ready'}
        </span>
      </div>
    </div>
  );
};
