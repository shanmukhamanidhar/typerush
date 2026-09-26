import { UserWeaknesses } from '../types/typing';

const STORAGE_KEY = 'typerush_weaknesses';

export function getStoredWeaknesses(): UserWeaknesses {
  if (typeof window === 'undefined') {
    return { missedWords: {}, slowWords: {}, missedBigrams: {} };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { missedWords: {}, slowWords: {}, missedBigrams: {} };
    return JSON.parse(raw);
  } catch {
    return { missedWords: {}, slowWords: {}, missedBigrams: {} };
  }
}

export function saveWeaknesses(weaknesses: UserWeaknesses): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weaknesses));
  } catch {
    // Failsafe
  }
}

/**
 * Record mistyped words and biwords into weakness database
 */
export function recordTestWeaknesses(passage: string, typedChars: string): void {
  const current = getStoredWeaknesses();
  const passageWords = passage.split(/\s+/).filter(Boolean);
  const typedWords = typedChars.split(/\s+/).filter(Boolean);

  // Compare words
  for (let i = 0; i < Math.min(passageWords.length, typedWords.length); i++) {
    const target = passageWords[i].toLowerCase().replace(/[^a-z]/g, '');
    const typed = typedWords[i].toLowerCase().replace(/[^a-z]/g, '');

    if (target.length >= 3 && target !== typed) {
      current.missedWords[target] = (current.missedWords[target] || 0) + 1;
    }
  }

  // Detect biword errors
  for (let i = 0; i < Math.min(passage.length - 1, typedChars.length - 1); i++) {
    if (passage[i] !== typedChars[i] || passage[i+1] !== typedChars[i+1]) {
      const biword = passage.slice(i, i+2).toLowerCase();
      if (/^[a-z]{2}$/.test(biword)) {
        current.missedBigrams[biword] = (current.missedBigrams[biword] || 0) + 1;
      }
    }
  }

  saveWeaknesses(current);
}

/**
 * Generates a practice passage focusing on the user's top missed words
 */
export function generateMissedWordsDrill(): { passage: string; targetedWords: string[] } {
  const weaknesses = getStoredWeaknesses();
  const sorted = Object.entries(weaknesses.missedWords)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);

  // If no tracked weaknesses yet, use high-frequency challenging vocabulary
  const defaultTargets = ['rhythm', 'subtle', 'precision', 'sequence', 'execution', 'parallel', 'frequency', 'system'];
  const targetedWords = sorted.length >= 3 ? sorted.slice(0, 8) : defaultTargets;

  // Interleave with connecting words to form natural typing rhythm
  const connectors = ['the', 'focus', 'on', 'with', 'direct', 'action', 'and', 'pure', 'speed', 'now', 'time', 'flow'];
  const drillWords: string[] = [];

  for (let i = 0; i < 28; i++) {
    if (i % 2 === 0) {
      const target = targetedWords[Math.floor(Math.random() * targetedWords.length)];
      drillWords.push(target);
    } else {
      const conn = connectors[Math.floor(Math.random() * connectors.length)];
      drillWords.push(conn);
    }
  }

  return {
    passage: drillWords.join(' '),
    targetedWords,
  };
}

/**
 * Generates biwords agility drills (e.g. th, er, on, an, re, he, in, ed, nd, ha, at)
 */
export function generateBiwordDrill(): { passage: string; targetedBiwords: string[] } {
  const weaknesses = getStoredWeaknesses();
  const sortedBiwords = Object.entries(weaknesses.missedBigrams)
    .sort((a, b) => b[1] - a[1])
    .map(([bg]) => bg);

  const defaultBigrams = ['th', 'er', 'on', 'an', 're', 'in', 'ed', 'st'];
  const targetedBiwords = sortedBiwords.length >= 2 ? sortedBiwords.slice(0, 5) : defaultBigrams;

  // Curated words rich in target bigrams
  const biwordDictionary: Record<string, string[]> = {
    th: ['the', 'that', 'other', 'with', 'think', 'thought', 'thread', 'path'],
    er: ['water', 'over', 'power', 'order', 'server', 'buffer', 'number'],
    on: ['control', 'action', 'reason', 'common', 'person', 'second'],
    an: ['stand', 'plant', 'balance', 'channel', 'command', 'standard'],
    re: ['result', 'render', 'record', 'return', 'reduce', 'restore'],
    in: ['point', 'engine', 'input', 'signal', 'string', 'binary'],
    ed: ['speed', 'feed', 'need', 'levelled', 'coded', 'handled'],
    st: ['state', 'start', 'status', 'master', 'system', 'fast']
  };

  const selectedWords: string[] = [];
  targetedBiwords.forEach(bg => {
    const list = biwordDictionary[bg] || ['test', 'fast', 'flow', 'type'];
    selectedWords.push(...list);
  });

  // Shuffle and repeat for muscle memory
  const drillWords: string[] = [];
  for (let i = 0; i < 25; i++) {
    drillWords.push(selectedWords[Math.floor(Math.random() * selectedWords.length)]);
  }

  return {
    passage: drillWords.join(' '),
    targetedBiwords,
  };
}
