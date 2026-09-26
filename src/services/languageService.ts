import { LanguagePack } from '../types/typing';
import { LANGUAGE_PACKS } from '../data/languagePacks';

export class LanguageService {
  private static defaultPackId = 'english';

  public static getAllPacks(): LanguagePack[] {
    return LANGUAGE_PACKS;
  }

  public static getPack(id: string): LanguagePack {
    const pack = LANGUAGE_PACKS.find(p => p.id === id);
    if (pack) return pack;
    return LANGUAGE_PACKS[0];
  }

  public static searchPacks(query: string): LanguagePack[] {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGE_PACKS;
    return LANGUAGE_PACKS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  public static generatePassage(
    packId: string, 
    count: number = 80, 
    options: { punctuation?: boolean; numbers?: boolean } = {}
  ): string {
    const pack = this.getPack(packId);
    const words = pack.words;
    if (words.length === 0) return "the quick brown fox jumps over the lazy dog";

    const resultWords: string[] = [];

    for (let i = 0; i < count; i++) {
      let chosenWord = words[Math.floor(Math.random() * words.length)];

      if (options.numbers && Math.random() > 0.85) {
        chosenWord = Math.floor(Math.random() * 999).toString();
      }

      resultWords.push(chosenWord);
    }

    if (options.punctuation) {
      return this.applyPunctuation(resultWords);
    }

    return resultWords.join(' ');
  }

  private static applyPunctuation(words: string[]): string {
    if (words.length === 0) return '';
    const result: string[] = [];
    let capitalizeNext = true;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (capitalizeNext && word.length > 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        capitalizeNext = false;
      }

      const isLastWord = i === words.length - 1;
      const isSentenceEnd = isLastWord || (i > 0 && i % (6 + Math.floor(Math.random() * 6)) === 0);

      if (!isLastWord && i > 0 && i % 4 === 0 && Math.random() > 0.6) {
        word += ',';
      } else if (isSentenceEnd) {
        const punctuationMarks = ['.', '.', '.', '?', '!'];
        word += punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
        capitalizeNext = true;
      }

      result.push(word);
    }

    const last = result[result.length - 1];
    if (!/[.!?]$/.test(last)) {
      result[result.length - 1] = last + '.';
    }

    return result.join(' ');
  }
}
