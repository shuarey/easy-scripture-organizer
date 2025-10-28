import type { SQLiteProviderProps, SQLiteDatabase } from 'expo-sqlite';

// Migration function (runs in onInit)
export async function migrateDatabase(db: SQLiteDatabase) {
  console.log('🗄️ Running migrations...');

  const DATABASE_VERSION = 1;
  const versionRow = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = versionRow?.user_version ?? 0;

  console.log('Current db version: ', versionRow);
  if (currentVersion >= DATABASE_VERSION) {
    console.log('✅ DB up to date');
    return
  }

  // Initial setup (v1)
  if (currentVersion === 0) {
    await db.execAsync(`
      -- Performance & integrity
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      -- Tables

      CREATE TABLE IF NOT EXISTS VERSE (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        book INTEGER NOT NULL,
        chapter INTEGER NOT NULL,
        verseNumber INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS COLLECTION (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS COLLECTION_VERSE (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        collection_id INTEGER NOT NULL,
        verse_id INTEGER NOT NULL,
        deleted TEXT DEFAULT 'N',
        FOREIGN KEY (collection_id) REFERENCES COLLECTION(id),
        FOREIGN KEY (verse_id) REFERENCES VERSE(id)
      );
    `);

    // --- Seed initial data ---
    console.log('🌱 Seeding initial verses and collections...');

    await db.execAsync(`
      INSERT INTO VERSE (book, chapter, verseNumber) VALUES
      (1, 1, 1),
      (43, 3, 16),
      (19, 23, 1),
      (50, 4, 13),
      (20, 3, 5);

      INSERT INTO COLLECTION (name) VALUES
      ('Creation Passages'),
      ('Faith and Strength'),
      ('God’s Love'),
      ('Wisdom Verses');

      INSERT INTO COLLECTION_VERSE (collection_id, verse_id) VALUES
      (1, 1),
      (2, 4),
      (2, 5),
      (3, 2),
      (4, 3);
    `);

    console.log('✅ Seed complete');
  }

  // Future migrations can go here
  await db.execAsync(`ALTER TABLE COLLECTION ADD COLUMN description TEXT DEFAULT ''`).then(() => {
    console.log('✅ Added description column to COLLECTION table');
  })
  .catch((error) => {
    console.error('Error adding description column to COLLECTION table:', error);
  }).finally(() => {
    console.log('adding db column step complete');
  });

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  console.log('✅ Migration complete!');
}

// Provider props
export const databaseProps: SQLiteProviderProps = {
  databaseName: 'verse-mark.db',
  onInit: migrateDatabase,
  options: {
    enableChangeListener: true, // For real-time updates
  },
  useSuspense: false,
  onError: (error) => console.error('DB Error:', error),
  children: null,
};
