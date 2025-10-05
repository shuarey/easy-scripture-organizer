import { BookEntry } from "../models/models";
import { getBooks } from "api/api";

class BookDictionarySingleton {
  private cache = new Map<string, BookEntry[]>();

  /**
   * Gets the list of books for a translation. If not cached, fetches from the endpoint and caches it.
   * @param translations The translation (key) to query.
   */
  async setBooks(translations: string[]) {
    translations.forEach(async (translation) => {
      if (!this.cache.has(translation)) {
        const books = await getBooks(translation);
        this.cache.set(translation, books);
      }
    });
  }

  getBookFromCache(translation: string, bookID: number): BookEntry | undefined {
    if (this.cache.has(translation)) {
        const books = this.cache.get(translation)!;
        return books.find(book => book.bookid === bookID);
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