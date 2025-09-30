import { BookEntry } from '../models/models';
import { bookDict } from '../services/translationDictionary';

type BooksProps = {
    translations: string[];
}
    
const Books = ({ translations }: BooksProps) => {

    bookDict.clearCache();
    const booksRes = bookDict.getBooks(translations[0]);
    console.log("Books fetched from dictionary:", booksRes);

    const bibleBooks = new Map<string, BookEntry[]>();
    bibleBooks.set("WLCC", [{ name: "בראשית", bookID: 1, chapters: 50 }, { name: "שמות", bookID: 2, chapters: 40 }]);
    bibleBooks.set("NKJV", [{ name: "Genesis", bookID: 1, chapters: 50 }, { name: "Exodus", bookID: 2, chapters: 40 }]);

    console.log("Books for translations:", bibleBooks);
    return bibleBooks;
}

export default Books;