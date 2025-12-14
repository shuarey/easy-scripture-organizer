import type { SQLiteDatabase } from 'expo-sqlite';
import { dbVerseResponse, Verse } from 'models/models';

export async function insertVerse(
  db: SQLiteDatabase,
  book: number,
  chapter: number,
  verseNumber: string
): Promise<number | null> {
  const result = await db
    .runAsync('INSERT INTO verse (book, chapter, verseNumber) VALUES (?, ?, ?)', [
      book,
      chapter,
      verseNumber,
    ])
    .then((e) => {
      return e.lastInsertRowId;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return result;
}

export async function getAllVerses(db: SQLiteDatabase): Promise<Verse[]> {
  return await db.getAllAsync<Verse>('SELECT * FROM verses ORDER BY book, chapter, verseNumber');
}

export async function getVerseByID(
  db: SQLiteDatabase,
  id: number
): Promise<dbVerseResponse | null> {
  const response = await db.getFirstAsync<dbVerseResponse>(`SELECT * FROM VERSE WHERE id = ${id}`);
  return response;
}

export async function getVersesByCollectionId(
  db: SQLiteDatabase,
  collectionId: number
): Promise<Verse[]> {
  const query = `SELECT V.ID, V.BOOK, V.CHAPTER, V.VERSENUMBER, CV.VERSIONS, CV.ORDINAL
                  FROM COLLECTION_VERSE CV
                  JOIN VERSE V
                  ON V.ID = CV.VERSE_ID
                  JOIN COLLECTION C
                  ON C.ID = CV.COLLECTION_ID
                  WHERE CV.COLLECTION_ID = ${collectionId};`;
  const result = await db
    .getAllAsync<Verse>(query)
    .then((rows) => {
      // Map database rows into properly shaped `Verse` objects.
      return rows.map((r) => {
        const row = r as unknown as Record<string, unknown>;

        const raw = (row['verseNumber'] ?? row['VERSENUMBER'] ?? row['versenumber'] ?? '') as
          | string
          | number
          | undefined;
        const asString = String(raw ?? '').trim();
        const verseNumbers: number[] = [];

        if (asString.includes('-')) {
          const parts = asString.split('-').map((p) => p.trim());
          const start = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);
          if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
            for (let i = start; i <= end; i++) verseNumbers.push(i);
          }
        } else {
          const n = parseInt(asString, 10);
          if (!Number.isNaN(n)) verseNumbers.push(n);
        }

        const pk = Number(row['ID'] ?? row['id'] ?? 0);
        const book = (row['BOOK'] ?? row['book'] ?? 0) as number | string;
        const chapter = Number(row['CHAPTER'] ?? row['chapter'] ?? 0);
        const versionsRaw = String(row['VERSIONS'] ?? row['versions'] ?? '');
        const ordinal = Number(row['ORDINAL'] ?? row['ordinal'] ?? 0);
        const verse_pk = Number(row['VERSE_ID'] ?? row['verse_id'] ?? 0);

        const verse: Verse = {
          pk,
          translation: versionsRaw,
          book,
          chapter,
          verseNumber: verseNumbers,
          text: '',
          collection_pk: collectionId,
          verse_pk,
          versions: versionsRaw ? versionsRaw.split(',').map((s) => s.trim()) : [],
          ordinal,
        };

        return verse;
      });
    })
    .catch((error) => {
      console.log(error.message);
      return [];
    });
  return result;
}
