import { UserSettings } from '../types/typing';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'dark',
  themeId: 'graphite-cyan',
  backgroundStyle: 'solid',

  // Sound (Subtle UI sounds, default OFF)
  soundEnabled: false,
  soundPack: 'mechanical',
  typingSound: 'soft',
  soundVolume: 35,
  errorSound: false,
  completionSound: false,

  // Caret
  cursorStyle: 'line',
  caretAnimation: 'smooth',
  caretColor: 'accent',
  caretOpacity: 100,

  // Appearance & Typography
  fontSize: 'md',
  fontFamily: 'times',
  uiDensity: 'comfortable',
  textOpacity: 'primary',

  // Behavior
  difficulty: 'medium',
  difficultyRule: 'normal',
  quickRestart: 'tab',
  repeatQuotes: 'off',
  blindMode: false,
  alwaysShowWordsHistory: false,
  singleListCommandLine: 'manual',
  minWpm: 0,
  minAccuracy: 0,

  // Input
  inputMode: 'standard',
  stopOnError: 'off',
  confidenceMode: false,
  freedomMode: false,
  strictSpace: false,
  quickEnd: true,
  pauseOnBlur: true,
  focusMode: false,

  // Pace Caret
  paceCaret: 'off',
  paceWpm: 80,

  // Hide Elements
  hideElements: {
    header: false,
    footer: false,
    timer: false,
    accuracy: false,
    wpm: false,
    graph: false,
    testConfig: false,
    progressBar: false,
    extraStats: false,
  },

  // Active Language
  language: 'english',

  // Presets & Tags
  presets: [],
  activeTags: [],
  availableTags: ['warmup', 'morning', 'mechanical', 'competition', 'focused', 'laptop'],

  // Keyboard Tester
  keyboardVisible: true,
  keymapLayout: 'qwerty',
  keymapMode: 'reactive',
  liveGraphVisible: true,
  countdownEnabled: false,
};

export interface SettingsSearchResult {
  sectionId: string;
  matchedSettingKey: string;
}

export class SettingsService {
  public static searchSettings(query: string): string[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return ['behavior', 'input', 'sound', 'caret', 'appearance', 'theme', 'hideElements', 'dangerZone'];
    }

    const matches = new Set<string>();

    // Behavior
    if (['difficulty', 'strict', 'restart', 'esc', 'tab', 'enter', 'quote', 'repeat', 'blind', 'history', 'command', 'speed', 'min', 'accuracy'].some(k => k.includes(q) || q.includes(k))) {
      matches.add('behavior');
    }

    // Input
    if (['input', 'error', 'stop', 'backspace', 'confidence', 'freedom', 'space', 'quick', 'end', 'blur', 'pause'].some(k => k.includes(q) || q.includes(k))) {
      matches.add('input');
    }

    // Sound
    if (['sound', 'audio', 'volume', 'click', 'beep', 'completion', 'noise', 'mute'].some(k => k.includes(q) || q.includes(k))) {
      matches.add('sound');
    }

    // Caret
    if (['caret', 'cursor', 'line', 'block', 'underline', 'blink', 'animation', 'opacity'].some(k => k.includes(q) || q.includes(k))) {
      matches.add('caret');
    }

    // Appearance
    if (['appearance', 'theme', 'dark', 'light', 'system', 'font', 'size', 'times', 'mono', 'density', 'opacity'].some(k => k.includes(q) || q.includes(k))) {
      matches.add('appearance');
      matches.add('theme');
    }

    // Hide Elements
    if (['hide', 'show', 'element', 'header', 'footer', 'timer', 'wpm', 'graph', 'progress', 'bar'].some(k => k.includes(q) || q.includes(k))) {
      matches.add('hideElements');
    }

    // Danger Zone
    if (['danger', 'reset', 'clear', 'history', 'delete', 'wipe'].some(k => k.includes(q) || q.includes(k))) {
      matches.add('dangerZone');
    }

    return Array.from(matches);
  }
}
