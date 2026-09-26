import { ThemeId, CustomThemeColors, BackgroundStyle } from '../types/typing';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
  colors: CustomThemeColors;
}

export const THEME_DEFINITIONS: Record<ThemeId, ThemeDefinition> = {
  'graphite-cyan': {
    id: 'graphite-cyan',
    name: 'Precision Orange',
    description: 'Official TYPERUSH: Pure Black + Precision Technical Orange',
    isDark: true,
    colors: {
      bg: '#000000',
      surface: '#0A0A0A',
      border: '#222222',
      text: '#FFFFFF',
      primary: '#FF5A00',
      error: '#FF3B5C',
    },
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Stealth',
    description: 'Pure Jet Black & Gunmetal Cool Silver',
    isDark: true,
    colors: {
      bg: '#050507',
      surface: '#111216',
      border: '#23252e',
      text: '#e2e8f0',
      primary: '#94a3b8',
      error: '#ef4444',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Crimson Ember',
    description: 'Dark Obsidian & Crimson Orange Glow',
    isDark: true,
    colors: {
      bg: '#0c0707',
      surface: '#180e0e',
      border: '#331c1c',
      text: '#fae8e8',
      primary: '#FF5A00',
      error: '#fb7185',
    },
  },
  terminal80: {
    id: 'terminal80',
    name: 'Terminal Orange',
    description: 'Phosphor Amber CRT Console',
    isDark: true,
    colors: {
      bg: '#0f0802',
      surface: '#1c1004',
      border: '#3b220b',
      text: '#FFB347',
      primary: '#FF8A00',
      error: '#ef4444',
    },
  },
  solarflare: {
    id: 'solarflare',
    name: 'Solar Flare',
    description: 'Dark Espresso Charcoal & Solar Amber',
    isDark: true,
    colors: {
      bg: '#140d07',
      surface: '#21160d',
      border: '#45260f',
      text: '#fef3c7',
      primary: '#FF8A00',
      error: '#dc2626',
    },
  },
  arctic: {
    id: 'arctic',
    name: 'Precision Amber',
    description: 'Deep Obsidian & Precision Amber Glow',
    isDark: true,
    colors: {
      bg: '#0a0a0a',
      surface: '#141414',
      border: '#2a2a2a',
      text: '#f5f5f5',
      primary: '#FF6E1A',
      error: '#f87171',
    },
  },
  'solar-orange': {
    id: 'solar-orange',
    name: 'Solar Orange',
    description: 'Warm Ember & Electric Orange',
    isDark: true,
    colors: {
      bg: '#140b04',
      surface: '#241407',
      border: '#4a290e',
      text: '#FFD199',
      primary: '#FF8A00',
      error: '#f43f5e',
    },
  },
  synthwave: {
    id: 'synthwave',
    name: 'Blaze Orange',
    description: 'Deep Night Onyx & Hyper Blaze Orange',
    isDark: true,
    colors: {
      bg: '#080808',
      surface: '#121212',
      border: '#2a2a2a',
      text: '#fafafa',
      primary: '#FF6E1A',
      error: '#f43f5e',
    },
  },
  'paper-light': {
    id: 'paper-light',
    name: 'Paper Studio Light',
    description: 'Official TYPERUSH: Pure White + Precision Orange',
    isDark: false,
    colors: {
      bg: '#FFFFFF',
      surface: '#F7F7F7',
      border: '#E5E5E5',
      text: '#111111',
      primary: '#FF5A00',
      error: '#FF3B5C',
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Studio Monochrome',
    description: 'Ultra High-Contrast Neutral Studio',
    isDark: true,
    colors: {
      bg: '#080808',
      surface: '#111111',
      border: '#2A2A2A',
      text: '#F5F5F5',
      primary: '#F5F5F5',
      error: '#FF3B5C',
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom Palette',
    description: 'User-Configured Custom Theme Colors',
    isDark: true,
    colors: {
      bg: '#080808',
      surface: '#111111',
      border: '#2A2A2A',
      text: '#F5F5F5',
      primary: '#FF5A00',
      error: '#FF3B5C',
    },
  },
};

/**
 * Injects CSS variables and sets background pattern classes on the document body/root
 */
export function applyTheme(
  themeId: ThemeId,
  customColors?: CustomThemeColors,
  backgroundStyle: BackgroundStyle = 'solid',
  themeMode?: 'dark' | 'light' | 'system'
): void {
  if (typeof document === 'undefined') return;

  const def = THEME_DEFINITIONS[themeId] || THEME_DEFINITIONS['graphite-cyan'];
  const colors = themeId === 'custom' && customColors ? customColors : def.colors;

  const root = document.documentElement;
  // If themeMode is explicitly passed, honor it (including system mode); otherwise fallback to theme definition isDark
  let isDark = def.isDark;
  if (themeMode === 'system') {
    isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else if (themeMode !== undefined) {
    isDark = themeMode === 'dark';
  }

  // Toggle Dark class
  if (isDark) {
    root.classList.add('dark');
    // Design Tokens
    root.style.setProperty('--background', '#000000');
    root.style.setProperty('--surface', '#0A0A0A');
    root.style.setProperty('--surface-hover', '#141414');
    root.style.setProperty('--text-primary', '#FFFFFF');
    root.style.setProperty('--text-secondary', '#A1A1A1');
    root.style.setProperty('--text-muted', '#646669');
    root.style.setProperty('--accent', '#FF5A00');
    root.style.setProperty('--error', '#FF3B5C');
    root.style.setProperty('--success', '#FF5A00');
    root.style.setProperty('--border', '#222222');
    root.style.setProperty('--caret', '#FF5A00');

    // Legacy Aliases
    root.style.setProperty('--color-bg', '#000000');
    root.style.setProperty('--color-surface', '#0A0A0A');
    root.style.setProperty('--color-card', '#000000');
    root.style.setProperty('--color-border', '#222222');
    root.style.setProperty('--color-text', '#FFFFFF');
    root.style.setProperty('--color-text-secondary', '#A1A1A1');
    root.style.setProperty('--color-primary', '#FF5A00');
    root.style.setProperty('--color-orange', '#FF5A00');
    root.style.setProperty('--color-orange-hover', '#FF6E1A');
    root.style.setProperty('--color-orange-highlight', 'rgba(255, 90, 0, 0.12)');
    root.style.setProperty('--color-success', '#FF5A00');
    root.style.setProperty('--color-error', '#FF3B5C');
  } else {
    root.classList.remove('dark');
    // Design Tokens
    root.style.setProperty('--background', '#FFFFFF');
    root.style.setProperty('--surface', '#FAFAFA');
    root.style.setProperty('--surface-hover', '#F0F0F0');
    root.style.setProperty('--text-primary', '#111111');
    root.style.setProperty('--text-secondary', '#666666');
    root.style.setProperty('--text-muted', '#999999');
    root.style.setProperty('--accent', '#FF5A00');
    root.style.setProperty('--error', '#FF3B5C');
    root.style.setProperty('--success', '#FF5A00');
    root.style.setProperty('--border', '#E5E5E5');
    root.style.setProperty('--caret', '#FF5A00');

    // Legacy Aliases
    root.style.setProperty('--color-bg', '#FFFFFF');
    root.style.setProperty('--color-surface', '#FAFAFA');
    root.style.setProperty('--color-card', '#FFFFFF');
    root.style.setProperty('--color-border', '#E5E5E5');
    root.style.setProperty('--color-text', '#111111');
    root.style.setProperty('--color-text-secondary', '#666666');
    root.style.setProperty('--color-primary', '#FF5A00');
    root.style.setProperty('--color-orange', '#FF5A00');
    root.style.setProperty('--color-orange-hover', '#FF6E1A');
    root.style.setProperty('--color-orange-highlight', 'rgba(255, 90, 0, 0.12)');
    root.style.setProperty('--color-success', '#FF5A00');
    root.style.setProperty('--color-error', '#FF3B5C');
  }

  // Background Pattern Handling
  const body = document.body;
  body.classList.remove('bg-pattern-grid', 'bg-pattern-dots', 'bg-pattern-scanlines');

  if (backgroundStyle === 'grid') {
    body.classList.add('bg-pattern-grid');
  } else if (backgroundStyle === 'dots') {
    body.classList.add('bg-pattern-dots');
  } else if (backgroundStyle === 'scanlines') {
    body.classList.add('bg-pattern-scanlines');
  }
}
