//#region Verse
export interface Verse {
  pk: number;
  translation: string;
  book: number | string;
  chapter: number;
  verseNumber: number;
  text: string;
}

export interface dbVerseResponse {
  id: number;
  book: number;
  chapter: number;
  verseNumber: number;
  created_at: Date;
}

export interface VerseDictionary {
  [translation: string]: Verse[];
}

export type VerseData = Verse[][];
//#endregion

//#region Collection
export interface Collection {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}
//#endregion

export type Translation = {
  short_name: string;
  full_name: string;
  updated: number;
}

export interface CollectionVerse {
  pk: number;
  collection_pk: number;
  verse_pk: number;
}

export type BookEntry = {
    bookid: number;
    name: string;
    chapters: number;
    chronorder: number;
}