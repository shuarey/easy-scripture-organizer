import { BookEntry, dbBookEntryResponse } from '../models/models';
import { useBookDictionary } from 'context/bookContext';
import BookChapterVerseCountJSON from '../assets/BookChapterVerseCount.json';
import { getBooks } from 'api/api';

class BookDictionarySingleton {
  private cache = new Map<string, BookEntry[]>();

  /**
   * Gets the list of books for a translation. If not cached, fetches from the endpoint and caches it.
   * @param translations The translation (key) to query.
   */
  async setBooks(translations: string[]) {
    const { setDictionary } = useBookDictionary();
    translations.forEach(async (translation) => {
      if (!this.cache.has(translation)) {
        const books: dbBookEntryResponse[] = await getBooks(translation);
        this.cache.set(translation, this.convertResponseToBookEntryArray(books));
        setDictionary(this.cache);
      }
    });
  }

  convertResponseToBookEntryArray(dbEntry: dbBookEntryResponse[]): BookEntry[] {
    const bookEntries: BookEntry[] = [];
    dbEntry.forEach((entry) => {
      const chapterInfo = BookChapterVerseCountJSON.find((b) => b.Id === entry.bookid);
      bookEntries.push({
        bookid: entry.bookid,
        name: entry.name,
        chapters: chapterInfo
          ? chapterInfo.Chapters.map((numVerses) => ({
              index: numVerses.Id,
              verses: numVerses.Verses,
            }))
          : [],
      });
    });
    return bookEntries;
  }

  getBookFromCache(translation: string, bookID: number): BookEntry | undefined {
    if (this.cache.has(translation)) {
      const books = this.cache.get(translation)!;
      return books.find((book) => book.bookid === bookID);
    }
    return undefined;
  }

  // Optional: Methods to clear cache if needed
  clearCache() {
    this.cache.clear();
  }

  clearTranslationCache(translation: string) {
    this.cache.delete(translation);
  }
}

export const bookDict = new BookDictionarySingleton();
