import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { LanguagePack } from '../../types/typing';
import { LanguageService } from '../../services/languageService';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  currentLanguageId: string;
  onSelectLanguage: (pack: LanguagePack) => void;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  currentLanguageId,
  onSelectLanguage,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredPacks = useMemo(() => {
    return LanguageService.searchPacks(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeItem = listRef.current.children[selectedIndex] as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredPacks.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredPacks.length) % Math.max(1, filteredPacks.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPacks[selectedIndex]) {
        onSelectLanguage(filteredPacks[selectedIndex]);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#222222] rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[80vh] transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5E5E5] dark:border-[#222222]">
          <Search className="w-4 h-4 text-[#646669]" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search language..."
            className="flex-1 bg-transparent text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-[#646669] outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 text-[#646669] hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-black/[0.02] dark:divide-white/[0.02]"
        >
          {filteredPacks.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#646669]">
              No matching language packs found.
            </div>
          ) : (
            filteredPacks.map((pack, idx) => {
              const isSelected = pack.id === currentLanguageId;
              const isHovered = idx === selectedIndex;

              return (
                <div
                  key={pack.id}
                  onClick={() => {
                    onSelectLanguage(pack);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors ${
                    isHovered
                      ? 'bg-black/[0.05] dark:bg-white/[0.05]'
                      : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  } ${isSelected ? 'text-[#FF5A00] font-bold' : 'text-[#111111] dark:text-[#E2E2E2]'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF5A00]' : 'text-[#646669]'}`} />
                    <div>
                      <div className="text-xs flex items-center gap-2">
                        <span>{pack.name}</span>
                        {pack.wordsCount && (
                          <span className="text-[10px] text-[#646669] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5">
                            {pack.wordsCount.toLocaleString()} words
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#646669] font-normal truncate max-w-xs mt-0.5">
                        {pack.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#FF5A00]" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="flex items-center justify-between px-4 py-2 text-[10px] text-[#646669] border-t border-[#E5E5E5] dark:border-[#222222] bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/5">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/5">enter</kbd> select</span>
          </div>
          <span><kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/5">esc</kbd> close</span>
        </div>

      </div>
    </div>
  );
};
