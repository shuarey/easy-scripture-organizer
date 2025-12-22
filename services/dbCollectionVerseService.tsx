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

export async function deleteCollectionVerseByVerseId(
  db: SQLiteDatabase,
  collectionID: number,
  verseID: number
) {
  console.log(`Deleting collection: ${collectionID} verse: ${verseID}`);
  await db
    .runAsync('DELETE FROM collection_verse WHERE collection_id = ? AND verse_id = ?', [
      collectionID,
      verseID,
    ])
    .catch((error) => {
      console.log('Failed to delete collection_verse', error);
    });
}
