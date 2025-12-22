//#region Verse
export interface Verse extends CollectionVerse {
  pk: number;
  translation: string;
  book: number | string;
  chapter: number;
  verseNumber: number[];
  verseNumberRaw?: string;
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

export type UserLanguage = {
  name: string;
  deleted: string;
};

export type Language = {
  id: number;
  name: string;
};

export type Translation = {
  short_name: string;
  full_name: string;
  updated: number;
};

export interface CollectionVerse {
  pk: number;
  collection_pk: number;
  verse_pk: number;
  versions: string[];
  ordinal: number;
}

export interface dbBookEntryResponse {
  bookid: number;
  name: string;
  chapters: number;
  chronorder: number;
}

export interface BookEntry {
  bookid: number;
  name: string;
  chapters: Chapter[];
}

export type Chapter = {
  index: number;
  verses: number;
};
