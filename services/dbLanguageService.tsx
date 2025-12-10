import type { SQLiteDatabase } from 'expo-sqlite';
import { UserLanguage } from 'models/models';

export async function insertUserLanguage(db: SQLiteDatabase, name: string): Promise<number | null> {
  const result = await db
    .runAsync('INSERT INTO USER_LANGUAGE (name) VALUES (?)', [name])
    .then((e) => {
      return e.lastInsertRowId;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return result;
}

export async function setDeletedByName(db: SQLiteDatabase, name: string | string[]) {
  const names = Array.isArray(name) ? name : [name];

  const result = await db
    .runAsync(`UPDATE USER_LANGUAGE SET deleted = 'Y' WHERE name IN (?)`, [names.join(', ')])
    .catch((error) => {
      console.log(error);
    });
}

export async function getAllUserLanguages(db: SQLiteDatabase): Promise<UserLanguage[]> {
  const query = `SELECT name, deleted FROM USER_LANGUAGE`;
  const result = await db.getAllAsync<UserLanguage>(query);
  return result;
}
