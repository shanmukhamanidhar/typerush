import { QuoteItem, CodeItem, CodeLanguage } from '../types/typing';
import { PASSAGES } from './passages';

export const QUOTES: QuoteItem[] = [
  {
    id: 'quote-1',
    author: 'Mahatma Gandhi',
    category: 'general',
    text: 'The future depends on what you do today. Live as if you were to die tomorrow. Learn as if you were to live forever.'
  },
  {
    id: 'quote-2',
    author: 'Alan Turing',
    category: 'technology',
    text: 'Sometimes it is the people no one can imagine anything of who do the things that no one can imagine.'
  },
  {
    id: 'quote-3',
    author: 'Grace Hopper',
    category: 'technology',
    text: 'The most dangerous phrase in the language is, We have always done it this way. A ship in port is safe, but that is not what ships are built for.'
  },
  {
    id: 'quote-4',
    author: 'Steve Jobs',
    category: 'technology',
    text: 'Your time is limited, so do not waste it living someone else life. Stay hungry, stay foolish, and never compromise on your craft.'
  },
  {
    id: 'quote-5',
    author: 'Linus Torvalds',
    category: 'programming',
    text: 'Talk is cheap. Show me the code. Most good programmers do programming not because they expect to get paid, but because it is fun.'
  },
  {
    id: 'quote-6',
    author: 'Ada Lovelace',
    category: 'science',
    text: 'The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.'
  },
  {
    id: 'quote-7',
    author: 'Marcus Aurelius',
    category: 'general',
    text: 'You have power over your mind, not outside events. Realize this, and you will find profound strength and inner clarity.'
  },
  {
    id: 'quote-8',
    author: 'Albert Einstein',
    category: 'science',
    text: 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.'
  }
];

export const CODE_SNIPPETS: CodeItem[] = [
  // --- C ---
  {
    id: 'c-1',
    language: 'c',
    title: 'Pointer String Reversal',
    code: `#include <stdio.h>
#include <string.h>

void reverse_str(char *str) {
  int len = strlen(str);
  char *start = str;
  char *end = str + len - 1;
  while (start < end) {
    char tmp = *start;
    *start++ = *end;
    *end-- = tmp;
  }
}`
  },

  // --- C++ ---
  {
    id: 'cpp-1',
    language: 'cpp',
    title: 'Template Binary Search',
    code: `template <typename T>
int binary_search(const std::vector<T>& arr, T target) {
  int left = 0;
  int right = arr.size() - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
  },

  // --- PYTHON ---
  {
    id: 'py-1',
    language: 'python',
    title: 'Fibonacci Generator',
    code: `def fibonacci_stream(limit: int):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

evens = [x for x in fibonacci_stream(100) if x % 2 == 0]`
  },

  // --- JAVASCRIPT ---
  {
    id: 'js-1',
    language: 'javascript',
    title: 'Async Retry Fetcher',
    code: `async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}`
  },

  // --- JAVA ---
  {
    id: 'java-1',
    language: 'java',
    title: 'Thread-Safe Singleton',
    code: `public class DatabaseConnection {
  private static volatile DatabaseConnection instance;
  private DatabaseConnection() {}

  public static DatabaseConnection getInstance() {
    if (instance == null) {
      synchronized (DatabaseConnection.class) {
        if (instance == null) instance = new DatabaseConnection();
      }
    }
    return instance;
  }
}`
  },

  // --- HTML ---
  {
    id: 'html-1',
    language: 'html',
    title: 'Semantic Accessible Form',
    code: `<form class="login-card" action="/api/auth" method="POST">
  <label for="user-email">Email Address</label>
  <input type="email" id="user-email" required placeholder="name@domain.com" />
  <button type="submit" class="btn primary">Authenticate</button>
</form>`
  },

  // --- CSS ---
  {
    id: 'css-1',
    language: 'css',
    title: 'Responsive Flex Grid',
    code: `.hud-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 240, 255, 0.25);
}`
  },

  // --- SQL ---
  {
    id: 'sql-1',
    language: 'sql',
    title: 'Analytical Window Aggregation',
    code: `SELECT user_id,
       AVG(wpm) OVER (PARTITION BY user_id) AS avg_speed,
       RANK() OVER (ORDER BY score DESC) AS leaderboard_rank
FROM typing_sessions
WHERE accuracy >= 95.0
ORDER BY leaderboard_rank ASC;`
  }
];

export function getQuote(): QuoteItem {
  const idx = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[idx];
}

export function getCodeSnippet(language: CodeLanguage): CodeItem {
  const filtered = CODE_SNIPPETS.filter(s => s.language === language);
  if (filtered.length > 0) {
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  return CODE_SNIPPETS[0];
}

export function getWordsPassage(wordCount: number): string {
  // Aggregate sentences from passages until wordCount is reached
  const pool = PASSAGES.map(p => p.text).join(' ');
  const words = pool.split(/\s+/).filter(Boolean);
  
  // Random start point
  const maxStart = Math.max(0, words.length - wordCount - 5);
  const start = Math.floor(Math.random() * maxStart);
  return words.slice(start, start + wordCount).join(' ');
}

export function getDeterministicDailyChallenge(dateStr: string): {
  id: string;
  passage: string;
  difficulty: 'medium' | 'hard';
  category: 'technology' | 'science' | 'general';
} {
  // Simple seed hash from date string (e.g., "2026-09-23")
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const selectedPassage = PASSAGES[absHash % PASSAGES.length];
  return {
    id: `daily-${dateStr}`,
    passage: selectedPassage.text,
    difficulty: selectedPassage.difficulty === 'easy' ? 'medium' : selectedPassage.difficulty,
    category: selectedPassage.category === 'programming' || selectedPassage.category === 'random' ? 'technology' : selectedPassage.category,
  };
}
