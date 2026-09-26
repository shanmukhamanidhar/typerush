import React from 'react';

interface Option<T> {
  value: T;
  label: string;
}

interface SettingControlProps<T> {
  title: string;
  description: string;
  options?: Option<T>[];
  value?: T;
  onChange?: (val: T) => void;
  type?: 'options' | 'toggle' | 'slider' | 'number' | 'action';
  min?: number;
  max?: number;
  step?: number;
  actionLabel?: string;
  onAction?: () => void;
  isDestructive?: boolean;
}

export function SettingControl<T>({
  title,
  description,
  options = [],
  value,
  onChange,
  type = 'options',
  min = 0,
  max = 100,
  step = 1,
  actionLabel,
  onAction,
  isDestructive = false,
}: SettingControlProps<T>) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-[#E5E5E5]/60 dark:border-[#222222]/60 font-mono text-xs">
      {/* Title & Description */}
      <div className="space-y-0.5 max-w-md">
        <div className="font-semibold text-[#111111] dark:text-[#F5F5F5]">
          {title}
        </div>
        <div className="text-[11px] text-[#646669] dark:text-[#888888] leading-relaxed">
          {description}
        </div>
      </div>

      {/* Control Area */}
      <div className="shrink-0 flex items-center">
        {type === 'options' && options.length > 0 && (
          <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.03] p-1 rounded-md border border-black/[0.03] dark:border-white/[0.03]">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  onClick={() => onChange && onChange(opt.value)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer capitalize ${
                    isSelected
                      ? 'bg-black/10 dark:bg-white/10 text-[#FF5A00] font-bold'
                      : 'text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {type === 'toggle' && (
          <button
            onClick={() => onChange && onChange(!value as unknown as T)}
            className={`px-3 py-1 rounded-md border text-xs font-semibold transition-colors cursor-pointer ${
              value
                ? 'border-[#FF5A00]/40 bg-[#FF5A00]/10 text-[#FF5A00]'
                : 'border-[#E5E5E5] dark:border-[#222222] text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
          >
            {value ? 'On' : 'Off'}
          </button>
        )}

        {type === 'slider' && (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={Number(value) || min}
              onChange={(e) => onChange && onChange(Number(e.target.value) as unknown as T)}
              className="w-28 sm:w-36 accent-[#FF5A00] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#FF5A00] w-9 text-right">
              {String(value)}
            </span>
          </div>
        )}

        {type === 'number' && (
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={Number(value) || 0}
            onChange={(e) => onChange && onChange(Number(e.target.value) as unknown as T)}
            className="w-20 px-2 py-1 rounded border border-[#E5E5E5] dark:border-[#222222] bg-transparent text-xs text-[#111111] dark:text-[#F5F5F5] outline-none text-right font-mono"
          />
        )}

        {type === 'action' && onAction && (
          <button
            onClick={onAction}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
              isDestructive
                ? 'border-[#FF3B5C]/30 text-[#FF3B5C] hover:bg-[#FF3B5C]/10'
                : 'border-[#E5E5E5] dark:border-[#222222] text-[#111111] dark:text-[#F5F5F5] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {actionLabel || 'Execute'}
          </button>
        )}
      </div>
    </div>
  );
}
