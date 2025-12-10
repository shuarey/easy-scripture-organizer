import type { SQLiteDatabase } from 'expo-sqlite';
import { Collection } from 'models/models';

export async function insertCollection(
  db: SQLiteDatabase,
  collection: Omit<Collection, 'id' | 'created_at'>
) {
  const result = await db.runAsync('INSERT INTO COLLECTION (name, description) VALUES (?, ?)', [
    collection.name,
    collection.description,
  ]);
  return result.lastInsertRowId;
}

export async function deleteCollection(db: SQLiteDatabase, collectionId: number) {
  await db.runAsync('DELETE FROM COLLECTION WHERE id = ?', [collectionId]);
}

export async function updateCollection(db: SQLiteDatabase, collection: Collection) {
  await db.runAsync('UPDATE COLLECTION SET name = ?, description = ? WHERE id = ?', [
    collection.name,
    collection.description,
    collection.id,
  ]);
}

export async function getAllCollections(db: SQLiteDatabase): Promise<Collection[]> {
  return await db.getAllAsync<Collection>('SELECT * FROM COLLECTION ORDER BY name');
}

export async function getCollectionById(
  db: SQLiteDatabase,
  collectionId: number
): Promise<Collection | null> {
  const collections = await getAllCollections(db);
  const collection = collections.find((col) => col.id === collectionId) || null;
  return collection || null;
}
