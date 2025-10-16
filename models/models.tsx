interface Verse {
  pk: number;
  translation: string;
  book: number | string;
  chapter: number;
  verseNumber: number;
  text: string;
}

interface VerseDictionary {
  [translation: string]: Verse[];
}

type VerseData = Verse[][];

type BookEntry = {
    bookid: number;
    name: string;
    chapters: number;
    chronorder: number;
}

export { Verse, VerseData, VerseDictionary, BookEntry };