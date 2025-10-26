import type { SQLiteDatabase } from 'expo-sqlite';
import { dbVerseResponse, Verse } from 'models/models';

export async function insertVerse(db: SQLiteDatabase, verse: Omit<Verse, 'id' | 'created_at'>) {
  const result = await db.runAsync(
    'INSERT INTO verses (book, chapter, verse) VALUES (?, ?, ?, ?)',
    [verse.text, verse.book, verse.chapter, verse.verseNumber]
  );
  return result.lastInsertRowId;
}

export async function getAllVerses(db: SQLiteDatabase): Promise<Verse[]> {
  return await db.getAllAsync<Verse>('SELECT * FROM verses ORDER BY book, chapter, verseNumber');
}

export async function getVerseByID(db: SQLiteDatabase, id: number): Promise<dbVerseResponse | null> {
  const response = await db.getFirstAsync<dbVerseResponse>(`SELECT * FROM VERSE WHERE id = ${id}`);
  return response;
}