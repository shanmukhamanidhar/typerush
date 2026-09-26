import { LanguageCode, WordSetSize, QuoteLength, CodeLanguage, QuoteItem, CodeItem } from '../types/typing';

// Top Dictionaries
export const LANGUAGE_DICTIONARIES: Record<LanguageCode, string[]> = {
  en: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he",
    "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
    "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about",
    "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know",
    "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
    "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how",
    "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day",
    "most", "us", "great", "between", "need", "system", "program", "world", "number", "always", "during",
    "never", "each", "group", "problem", "fact", "stand", "against", "under", "both", "last", "result",
    "level", "line", "point", "power", "value", "place", "state", "public", "human", "order", "right",
    "move", "face", "build", "lead", "process", "water", "small", "large", "change", "simple", "speed",
    "focus", "direct", "early", "future", "matter", "sense", "reason", "modern", "design", "record",
    "market", "course", "action", "force", "model", "match", "drive", "effect", "space", "field", "light",
    "clear", "strong", "energy", "stream", "engine", "memory", "input", "output", "screen", "button",
    "signal", "network", "client", "server", "access", "domain", "buffer", "matrix", "frame", "render",
    "device", "vector", "source", "packet", "socket", "status", "switch", "thread", "bridge", "module",
    "cursor", "format", "prompt", "window", "native", "syntax", "target", "schema", "symbol", "binary",
    "update", "create", "delete", "insert", "select", "manage", "deploy", "import", "export", "secure",
    "filter", "handle", "invoke", "launch", "verify", "listen", "accept", "define", "expand", "reduce"
  ],
  'en-gb': [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "as",
    "you", "do", "at", "this", "but", "by", "from", "they", "we", "say", "or", "an", "will", "my", "one",
    "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which",
    "colour", "favour", "labour", "flavour", "honour", "humour", "rumour", "splendour", "vigour", "armour",
    "theatre", "centre", "metre", "fibre", "litre", "calibre", "lustre", "spectre", "sombre", "meagre",
    "analyse", "paralyse", "catalyse", "organise", "realise", "recognise", "criticise", "emphasise",
    "programme", "catalogue", "dialogue", "monologue", "defence", "offence", "pretence", "licence",
    "practise", "travelling", "cancelled", "fuelled", "levelled", "modelled", "panelled", "signalled",
    "grey", "cheque", "draught", "plough", "pyjamas", "tyre", "aeroplane", "aluminium", "speciality",
    "time", "people", "into", "year", "good", "some", "could", "them", "see", "other", "than", "then",
    "system", "world", "number", "always", "during", "never", "group", "problem", "against", "under"
  ],
  es: [
    "de", "la", "que", "el", "en", "y", "a", "los", "se", "del", "las", "un", "por", "con", "no", "una",
    "su", "para", "es", "al", "lo", "como", "más", "pero", "sus", "le", "ya", "o", "este", "sí", "porque",
    "esta", "son", "entre", "cuando", "muy", "sin", "sobre", "también", "me", "hasta", "hay", "donde",
    "quien", "desde", "todo", "nos", "durante", "todos", "uno", "les", "ni", "contra", "otros", "ese",
    "eso", "ante", "ellos", "esto", "mí", "antes", "algunos", "unos", "yo", "otro", "otras", "otra",
    "él", "tanto", "esa", "estos", "mucho", "quienes", "nada", "muchos", "cual", "sea", "poco", "ella",
    "estar", "haber", "hacer", "decir", "poder", "ir", "ver", "dar", "saber", "querer", "llegar", "pasar",
    "tiempo", "año", "día", "hombre", "vida", "mano", "parte", "ojo", "lugar", "trabajo", "semana",
    "caso", "punto", "gobierno", "empresa", "país", "mundo", "forma", "fuerza", "luz", "camino", "voz"
  ],
  fr: [
    "comme", "son", "que", "il", "était", "pour", "sur", "sont", "avec", "ils", "être", "un", "avoir",
    "ce", "de", "pas", "dans", "autre", "nous", "faire", "leur", "temps", "si", "volonté", "comment",
    "dit", "chaque", "dire", "ne", "ensemble", "trois", "vouloir", "air", "bien", "aussi", "jouer",
    "petit", "fin", "mettre", "maison", "grand", "début", "main", "pays", "ici", "devoir", "haut",
    "tel", "suivre", "acte", "pourquoi", "interroger", "hommes", "changement", "aller", "lumière",
    "genre", "hors", "besoin", "image", "essayer", "encore", "animal", "point", "mère", "monde",
    "près", "construire", "terre", "père", "tête", "debout", "propre", "page", "devrait", "pays",
    "trouvé", "réponse", "école", "croître", "étude", "encore", "apprendre", "usine", "nourriture", "soleil"
  ],
  de: [
    "wie", "ich", "seine", "dass", "er", "war", "für", "auf", "sind", "mit", "sie", "sein", "bei", "ein",
    "haben", "dies", "aus", "durch", "heiß", "Wort", "aber", "was", "einige", "ist", "es", "oder", "hatte",
    "die", "von", "zu", "und", "wir", "können", "andere", "waren", "tun", "ihre", "Zeit", "wenn", "sagte",
    "jeder", "sagen", "tut", "Satz", "drei", "wollen", "Luft", "gut", "auch", "spielen", "klein", "Ende",
    "setzen", "Start", "Hand", "Hafen", "groß", "buchstabieren", "hinzufügen", "Land", "hier", "muss",
    "hoch", "folgen", "Akt", "warum", "fragen", "Männer", "Veränderung", "ging", "Licht", "Art", "brauchen",
    "Haus", "Bild", "versuchen", "uns", "wieder", "Tier", "Punkt", "Mutter", "Welt", "bauen", "selbst", "Erde"
  ],
  it: [
    "come", "suo", "che", "lui", "era", "per", "sono", "con", "essi", "essere", "uno", "avere", "questo",
    "caldo", "parola", "ma", "cosa", "alcuni", "esso", "aveva", "di", "noi", "possiamo", "fuori", "altri",
    "erano", "fare", "loro", "tempo", "se", "volontà", "detto", "ogni", "dire", "set", "tre", "desidera",
    "aria", "bene", "anche", "giocare", "piccolo", "fine", "mettere", "casa", "grande", "inizio", "mano",
    "porto", "aggiungere", "terra", "qui", "deve", "alto", "seguire", "atto", "perché", "chiedere", "uomini",
    "cambiare", "luce", "tipo", "spento", "bisogno", "immagine", "provare", "ancora", "animale", "punto", "madre"
  ],
  pt: [
    "como", "seu", "que", "ele", "foi", "para", "em", "são", "com", "eles", "ser", "uma", "ter", "este",
    "desde", "por", "quente", "palavra", "mas", "alguns", "você", "teve", "nós", "podemos", "fora",
    "outros", "foram", "fazer", "tempo", "vontade", "disse", "cada", "dizer", "conjunto", "três", "querer",
    "bem", "também", "jogar", "pequeno", "fim", "colocar", "casa", "grande", "início", "mão", "porto",
    "adicionar", "mesmo", "terra", "aqui", "deve", "alto", "siga", "ato", "perguntar", "homens", "mudança",
    "luz", "tipo", "precisa", "imagem", "tentar", "novamente", "animal", "ponto", "mãe", "mundo", "perto"
  ],
  nl: [
    "als", "zijn", "dat", "hij", "was", "voor", "op", "met", "ze", "bij", "een", "hebben", "deze", "van",
    "door", "heet", "woord", "maar", "wat", "sommige", "het", "had", "naar", "en", "kan", "uit", "andere",
    "waren", "die", "doen", "hun", "tijd", "wil", "hoe", "zei", "elk", "vertellen", "doet", "drie", "willen",
    "lucht", "goed", "ook", "spelen", "klein", "einde", "zetten", "thuis", "groot", "start", "hand", "poort",
    "toevoegen", "land", "hier", "moet", "hoog", "volg", "daad", "waarom", "vragen", "mannen", "verandering",
    "ging", "licht", "soort", "nodig", "huis", "beeld", "proberen", "ons", "weer", "dier", "punt", "moeder"
  ],
  'ja-ro': [
    "watashi", "anata", "kore", "sore", "are", "dore", "koko", "soko", "asoko", "doko", "dare", "nani",
    "itsu", "doushite", "dou", "kono", "sono", "ano", "dono", "hai", "iie", "arigatou", "sumimasen",
    "ohayou", "konnichiwa", "konbanwa", "oyasumi", "sayounara", "gomen", "daijoubu", "nihon", "tokyo",
    "gakko", "tomodachi", "sensei", "kazoku", "ie", "hon", "kuruma", "denwa", "jikan", "kyou", "ashita",
    "kinou", "ima", "asa", "hiru", "yoru", "hito", "onna", "otoko", "kodomo", "kokoro", "ai", "yume",
    "kibou", "sora", "umi", "yama", "kawa", "ame", "yuki", "kaze", "hana", "ki", "inu", "neko", "tori",
    "sakana", "taberu", "nomu", "miru", "kiku", "hanasu", "yomu", "kaku", "iku", "kuru", "kaeru", "suru",
    "dekiru", "wakaru", "shiru", "omou", "sagasu", "matsu", "motsu", "tsukau", "yasashii", "hayai", "omoshiroi"
  ]
};

// Rich Quotes categorized by length
export const EXPANDED_QUOTES: QuoteItem[] = [
  // SHORT QUOTES (< 80 chars)
  {
    id: 'qs-1',
    author: 'Steve Jobs',
    text: 'Stay hungry, stay foolish.',
    category: 'technology',
    lengthTier: 'short',
  },
  {
    id: 'qs-2',
    author: 'Alan Turing',
    text: 'Sometimes it is the people no one imagines anything of who do the things that no one can imagine.',
    category: 'technology',
    lengthTier: 'short',
  },
  {
    id: 'qs-3',
    author: 'Marcus Aurelius',
    text: 'The soul becomes dyed with the color of its thoughts.',
    category: 'general',
    lengthTier: 'short',
  },
  {
    id: 'qs-4',
    author: 'Linus Torvalds',
    text: 'Talk is cheap. Show me the code.',
    category: 'programming',
    lengthTier: 'short',
  },
  {
    id: 'qs-5',
    author: 'Marie Curie',
    text: 'Nothing in life is to be feared, it is only to be understood.',
    category: 'science',
    lengthTier: 'short',
  },
  {
    id: 'qs-6',
    author: 'Albert Einstein',
    text: 'In the middle of difficulty lies opportunity.',
    category: 'science',
    lengthTier: 'short',
  },

  // MEDIUM QUOTES (80 - 180 chars)
  {
    id: 'qm-1',
    author: 'Grace Hopper',
    text: 'The most dangerous phrase in the language is, "We have always done it this way." Strive to innovate beyond past constraints.',
    category: 'technology',
    lengthTier: 'medium',
  },
  {
    id: 'qm-2',
    author: 'Ada Lovelace',
    text: 'The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves in silken fabrics.',
    category: 'technology',
    lengthTier: 'medium',
  },
  {
    id: 'qm-3',
    author: 'Carl Sagan',
    text: 'Somewhere, something incredible is waiting to be known. We are a way for the cosmos to know itself.',
    category: 'science',
    lengthTier: 'medium',
  },
  {
    id: 'qm-4',
    author: 'Richard Feynman',
    text: 'What I cannot create, I do not understand. Know how to solve every problem that has been solved.',
    category: 'science',
    lengthTier: 'medium',
  },
  {
    id: 'qm-5',
    author: 'Donald Knuth',
    text: 'Premature optimization is the root of all evil in software engineering. Build clean abstractions first.',
    category: 'programming',
    lengthTier: 'medium',
  },
  {
    id: 'qm-6',
    author: 'Leonardo da Vinci',
    text: 'Simplicity is the ultimate sophistication. When work flows effortlessly, true mastery has been attained.',
    category: 'general',
    lengthTier: 'medium',
  },

  // LONG QUOTES (> 180 chars)
  {
    id: 'ql-1',
    author: 'Nikola Tesla',
    text: 'The progressive development of man is vitally dependent on invention. It is the most important product of his creative brain. Its ultimate purpose is the complete mastery of mind over the material world, the harnessing of human nature to human needs.',
    category: 'science',
    lengthTier: 'long',
  },
  {
    id: 'ql-2',
    author: 'Claude Shannon',
    text: 'Information is the resolution of uncertainty. A mathematical theory of communication reveals that symbols, bandwidth, and noise govern the flow of intelligence across every channel in our modern world.',
    category: 'technology',
    lengthTier: 'long',
  },
  {
    id: 'ql-3',
    author: 'Bertrand Russell',
    text: 'Do not fear to be eccentric in opinion, for every opinion now accepted was once eccentric. Real intellectual courage means testing your beliefs against evidence rather than tradition or emotional comfort.',
    category: 'general',
    lengthTier: 'long',
  },
  {
    id: 'ql-4',
    author: 'John von Neumann',
    text: 'If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is. In computing, precision and sequential logic open portals to uncharted computational realms.',
    category: 'programming',
    lengthTier: 'long',
  }
];

// Rich Code Snippets for all supported languages
export const EXPANDED_CODE_SNIPPETS: CodeItem[] = [
  {
    id: 'c-1',
    language: 'c',
    title: 'Pointer Buffer Swap',
    code: `void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`
  },
  {
    id: 'cpp-1',
    language: 'cpp',
    title: 'Vector Transform Pipeline',
    code: `std::vector<int> squares(const std::vector<int>& v) {
    std::vector<int> res;
    for (const auto& item : v) {
        res.push_back(item * item);
    }
    return res;
}`
  },
  {
    id: 'python-1',
    language: 'python',
    title: 'Generator Comprehension',
    code: `def fibonacci_stream(limit: int):
    a, b = 0, 1
    for _ in range(limit):
        yield a
        a, b = b, a + b`
  },
  {
    id: 'javascript-1',
    language: 'javascript',
    title: 'Debounce Async Dispatcher',
    code: `const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};`
  },
  {
    id: 'typescript-1',
    language: 'typescript',
    title: 'Generic Cache Interface',
    code: `interface CacheStore<T> {
    get(key: string): T | undefined;
    set(key: string, value: T, ttlMs?: number): void;
    has(key: string): boolean;
}`
  },
  {
    id: 'rust-1',
    language: 'rust',
    title: 'Pattern Matching Result',
    code: `fn divide(numerator: f64, denominator: f64) -> Result<f64, &'static str> {
    if denominator == 0.0 {
        Err("Division by zero")
    } else {
        Ok(numerator / denominator)
    }
}`
  },
  {
    id: 'go-1',
    language: 'go',
    title: 'Concurrent Worker Channel',
    code: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}`
  },
  {
    id: 'java-1',
    language: 'java',
    title: 'Binary Search Tree Node',
    code: `public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}`
  },
  {
    id: 'html-1',
    language: 'html',
    title: 'Semantic Article Card',
    code: `<article class="card">
    <header><h3>Neural Network</h3></header>
    <p>Realtime processing engine.</p>
</article>`
  },
  {
    id: 'css-1',
    language: 'css',
    title: 'Futuristic Glow Keyframes',
    code: `.neon-cursor {
    display: inline-block;
    width: 2.5px;
    height: 1.25em;
    background: #FF5A00;
    box-shadow: 0 0 12px rgba(255, 90, 0, 0.6);
}`
  },
  {
    id: 'sql-1',
    language: 'sql',
    title: 'Aggregated Performance Index',
    code: `SELECT user_id, AVG(wpm) as avg_speed, MAX(wpm) as pb_speed
FROM typing_tests
WHERE accuracy >= 95.0
GROUP BY user_id
ORDER BY pb_speed DESC;`
  }
];

export interface PassageGenerationOptions {
  language: LanguageCode;
  wordSetSize: WordSetSize;
  wordCount: number;
  punctuation: boolean;
  numbers: boolean;
}

/**
 * Deterministically or randomly creates passages combining vocabulary, punctuation, and numbers.
 */
export function generateConfiguredPassage(options: PassageGenerationOptions): string {
  const { language, wordSetSize, wordCount, punctuation, numbers } = options;

  const baseWords = LANGUAGE_DICTIONARIES[language] || LANGUAGE_DICTIONARIES.en;
  
  // Slice to requested word set size
  const maxPoolSize = typeof wordSetSize === 'number' ? wordSetSize : baseWords.length;
  const wordPool = baseWords.slice(0, Math.min(baseWords.length, maxPoolSize));

  if (wordPool.length === 0) {
    return "The quick brown fox jumps over the lazy dog.";
  }

  const generatedWords: string[] = [];
  let lastWord = '';

  for (let i = 0; i < wordCount; i++) {
    // Pick random word avoiding immediate duplicate
    let chosenWord = '';
    let attempts = 0;
    do {
      chosenWord = wordPool[Math.floor(Math.random() * wordPool.length)];
      attempts++;
    } while (chosenWord === lastWord && attempts < 10);

    lastWord = chosenWord;

    // Optional numbers injection (~every 7-10 words if enabled)
    if (numbers && i > 0 && i % 7 === 0 && Math.random() > 0.3) {
      const numOptions = [
        Math.floor(Math.random() * 90 + 10).toString(),
        (2020 + Math.floor(Math.random() * 10)).toString(),
        (Math.floor(Math.random() * 50) + 1).toString(),
        `${Math.floor(Math.random() * 95 + 5)}%`,
        (Math.random() * 10).toFixed(1)
      ];
      const insertedNum = numOptions[Math.floor(Math.random() * numOptions.length)];
      generatedWords.push(insertedNum);
      if (generatedWords.length >= wordCount) break;
    }

    generatedWords.push(chosenWord);
  }

  // If punctuation enabled, naturally punctuate the sentence
  if (punctuation) {
    return applyNaturalPunctuation(generatedWords);
  }

  return generatedWords.join(' ');
}

/**
 * Adds natural punctuation: sentence capitalization, commas, quotes, periods, questions.
 */
function applyNaturalPunctuation(words: string[]): string {
  if (words.length === 0) return '';

  const result: string[] = [];
  let isStartOfSentence = true;

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // Capitalize sentence start
    if (isStartOfSentence && word.length > 0) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
      isStartOfSentence = false;
    }

    const isLastWord = i === words.length - 1;
    const sentenceLength = 6 + Math.floor(Math.random() * 7); // 6-12 words per sentence

    // Clause comma
    if (!isLastWord && i > 0 && i % 4 === 0 && Math.random() > 0.6) {
      word += ',';
    } 
    // Sentence ending
    else if (isLastWord || (i > 0 && i % sentenceLength === 0)) {
      const endMarks = ['.', '.', '.', '?', '!'];
      const mark = endMarks[Math.floor(Math.random() * endMarks.length)];
      word += mark;
      isStartOfSentence = true;
    }

    // Occasional quote
    if (i % 9 === 3 && Math.random() > 0.7 && !isLastWord) {
      word = `"${word}"`;
    }

    result.push(word);
  }

  // Ensure last word has a period
  let last = result[result.length - 1];
  if (!/[.!?]$/.test(last)) {
    result[result.length - 1] = last + '.';
  }

  return result.join(' ');
}

/**
 * Filter quotes by length tier
 */
export function getQuotesByLength(lengthTier: QuoteLength): QuoteItem {
  let filtered = EXPANDED_QUOTES;
  if (lengthTier !== 'random') {
    filtered = EXPANDED_QUOTES.filter(q => q.lengthTier === lengthTier);
    if (filtered.length === 0) filtered = EXPANDED_QUOTES;
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Get code snippet by language
 */
export function getCodeByLanguage(lang: CodeLanguage): CodeItem {
  const match = EXPANDED_CODE_SNIPPETS.find(c => c.language === lang);
  if (match) return match;
  return EXPANDED_CODE_SNIPPETS[0];
}
