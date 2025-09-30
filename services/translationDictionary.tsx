import { BookEntry } from "../models/models";
import { getBooks } from "api/api";

class BookDictionarySingleton {
  private cache = new Map<string, BookEntry[]>();

  /**
   * Gets the list of books for a translation. If not cached, fetches from the endpoint and caches it.
   * @param translation The translation (key) to query.
   * @returns A promise resolving to the list of BookEntry objects.
   */
  async getBooks(translation: string): Promise<BookEntry[]> {
    if (this.cache.has(translation)) {
        console.log("Books found in cache for translation:", translation);
      return this.cache.get(translation)!;
    }

    console.log("Fetching books for translation:", translation);
    const books = await getBooks(translation);
    this.cache.set(translation, books);
    return books;
  }

  /**
   * Gets a specific book by bookID within a translation. Lazily loads the translation's books if needed.
   * @param translation The translation (key).
   * @param bookID The ID of the specific book to find.
   * @returns A promise resolving to the BookEntry if found, or undefined if not.
   */
  async getBookById(translation: string, bookID: number): Promise<BookEntry | undefined> {
    const books = await this.getBooks(translation);
    return books.find(book => book.bookID === bookID);
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