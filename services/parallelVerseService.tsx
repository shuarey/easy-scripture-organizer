import { getParallelVerses } from 'api/api';
import { Verse, VerseData, VerseDictionary } from '../models/models';

type getParallelVersesProps = {
  translations: string[];
  book: number;
  chapter: number;
  verseNumbers: number[];
};

class ParallelVerseSingleton {
  private verseData: VerseData | null = null;
  private verseDict: VerseDictionary = {};

  async getParallelVerses({ translations, book, chapter, verseNumbers }: getParallelVersesProps) {
    
    this.verseData = await getParallelVerses(translations, book, chapter, verseNumbers);

    this.verseData!.forEach((translationGroup: Verse[]) => {
      if (translationGroup.length > 0) {
        const translation = translationGroup[0].translation;
        this.verseDict[translation] = translationGroup;
      }
    });
  }

  async getVerseTextByTranslation(translation: string): Promise<string | undefined> {
    const verses: Verse[] = this.verseDict[translation];
    let verseText = '';

    verses.forEach((verse: Verse) => {
      verseText += `<p><sup>${verse.verseNumber}</sup> ${verse.text}</p>\n`;
    });
    return verseText.trim() || undefined;
  }
}

export const parallelVerseService = new ParallelVerseSingleton();
