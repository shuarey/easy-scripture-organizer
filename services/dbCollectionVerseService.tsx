import { SQLiteDatabase } from 'expo-sqlite';

export async function insertCollectionVerse(
  db: SQLiteDatabase,
  collectionID: number,
  verseID: number,
  versions: string
) {
  const result = await db
    .runAsync('INSERT INTO collection_verse (verse_id, collection_id, versions) VALUES (?, ?, ?)', [
      verseID,
      collectionID,
      versions,
    ])
    .catch((error) => {
      console.log(error);
    });
}

export async function getCollectionVerseByID() {}
