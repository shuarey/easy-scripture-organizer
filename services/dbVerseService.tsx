import type { SQLiteDatabase } from 'expo-sqlite';
import { dbVerseResponse, Verse } from 'models/models';

export async function insertVerse(db: SQLiteDatabase, book: number, chapter: number, verseNumber: string): Promise<number | null> {
  const result = await db.runAsync(
    'INSERT INTO verse (book, chapter, verseNumber) VALUES (?, ?, ?)',
    [book, chapter, verseNumber]
  ).then((e) => {
    return e.lastInsertRowId;
  }).catch( (error) => {
    console.log(error);
    return null;
  });
  return result;
}

export async function getAllVerses(db: SQLiteDatabase): Promise<Verse[]> {
  return await db.getAllAsync<Verse>('SELECT * FROM verses ORDER BY book, chapter, verseNumber');
}

export async function getVerseByID(db: SQLiteDatabase, id: number): Promise<dbVerseResponse | null> {
  const response = await db.getFirstAsync<dbVerseResponse>(`SELECT * FROM VERSE WHERE id = ${id}`);
  return response;
}

export async function getVersesByCollectionId(db: SQLiteDatabase, collectionId: number): Promise<Verse[]> {
  const query = `SELECT V.ID, V.BOOK, V.CHAPTER, V.VERSENUMBER 
                  FROM COLLECTION_VERSE CV
                  JOIN VERSE V
                  ON V.ID = CV.VERSE_ID
                  JOIN COLLECTION C
                  ON C.ID = CV.COLLECTION_ID
                  WHERE CV.COLLECTION_ID = ${collectionId};`
  const result = await db.getAllAsync<Verse>(query);
  return result;
}