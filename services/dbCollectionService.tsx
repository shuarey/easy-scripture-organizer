import type { SQLiteDatabase } from 'expo-sqlite';
import { Collection } from 'models/models';

export async function insertCollection(db: SQLiteDatabase, collection: Omit<Collection, 'id' | 'created_at'>) {
  const result = await db.runAsync(
    'INSERT INTO COLLECTION (name, description) VALUES (?, ?)',
    [collection.name, collection.description]
  );
  return result.lastInsertRowId;
}

export async function getAllCollections(db: SQLiteDatabase): Promise<Collection[]> {
  return await db.getAllAsync<Collection>('SELECT * FROM COLLECTION ORDER BY name');
}