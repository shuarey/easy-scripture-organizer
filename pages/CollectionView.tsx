import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Button, Overlay } from 'react-native-elements';

import { insertCollectionVerse } from 'services/dbCollectionVerseService';
import { getVersesByCollectionId, insertVerse } from 'services/dbVerseService';

import { LoadingScreen } from 'components/LoadingScreen';
import { PickerComponent } from 'components/Picker';
import { Container } from 'components/Container';
import { ScreenContent } from 'components/ScreenContent';
import ScriptureEntry from 'components/ScriptureEntry';

import BookChapterVerseCountJSON from '../assets/BookChapterVerseCount.json';
import { RangePicker } from 'components/RangePicker';

type CollectionViewProps = {
  route: {
    params: {
      CollectionName: string;
      CollectionKey: number;
    };
  };
};

export default function CollectionView({ route }: CollectionViewProps) {
  const db = useSQLiteContext();

  const [dbVerses, setDbVerses] = useState<
    {
      book: string | number;
      chapter: number;
      verseNumber: number;
      versions: string[];
      ordinal: number;
    }[]
  >([]);

  const [newVerse, setNewVerse] = useState<{
    Book: number;
    Chapter: number;
    Verse: string;
  }>({ Book: 0, Chapter: 0, Verse: '' });

  const bookSelected = newVerse.Book !== 0;
  const chapterSelected = newVerse.Chapter !== 0;

  const [allBooks, setAllBooks] = useState<
    {
      id: number;
      text: string;
    }[]
  >([]);

  const [bookChapters, setBookChapters] = useState<
    {
      id: number;
      text: string;
    }[]
  >([]);

  const { CollectionName, CollectionKey } = route.params;
  const [chapterVerseCount, setChapterVerseCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showAddVerseOverlay, setShowAddVerseOverlay] = useState(false);

  useEffect(() => {
    setLoading(true);
    getVersesByCollectionId(db, CollectionKey)
      .then((verses) => {
        setDbVerses(verses);
        setAllBooks(
          Object.entries(BookChapterVerseCountJSON).map(([key, value]) => ({
            id: parseInt(key) + 1,
            text: value.Name,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const bookId = newVerse.Book;
    if (bookId === 0) {
      setBookChapters([]);
      return;
    }
    const chapters = BookChapterVerseCountJSON[bookId - 1]?.Chapters || [];
    setBookChapters(
      chapters.map((chapter, index) => ({
        id: index + 1,
        text: `${index + 1}`,
      }))
    );
  }, [newVerse.Book]);

  useEffect(() => {
    const bookId = newVerse.Book;
    const chapterId = newVerse.Chapter;
    if (bookId === 0 || chapterId === 0) {
      setChapterVerseCount(0);
      return;
    }
    const verseCount = BookChapterVerseCountJSON[bookId - 1]?.Chapters[chapterId - 1] || 0;
    setChapterVerseCount(verseCount.Verses);
  }, [newVerse.Book, newVerse.Chapter]);

  function handleInputChange(key: string, value: string | number) {
    setNewVerse({
      ...newVerse,
      [key]: value,
    });
  }

  useEffect(() => {
    setNewVerse((prev) => ({
      ...prev,
      Chapter: 0,
      Verse: '',
    }));
  }, [newVerse.Book]);

  useEffect(() => {
    setNewVerse((prev) => ({
      ...prev,
      Verse: '',
    }));
  }, [newVerse.Chapter]);

  async function handleAddVerse() {
    console.log(`Book: ${newVerse.Book}, Chapter: ${newVerse.Chapter}, Verse: ${newVerse.Verse}`);
    await insertVerse(db, newVerse.Book, newVerse.Chapter, newVerse.Verse)
      .then((verseID) => {
        // insert into collection_verse with default version
        // this will be set by a Settings component
        // for now this is just hardcoded
        const defaultVersion = 'NKJV';
        insertCollectionVerse(db, CollectionKey, verseID as number, defaultVersion);
      })
      .finally(() => setShowAddVerseOverlay(false));
  }

  if (loading) return <LoadingScreen />;

  return (
    <Container>
      <ScreenContent title={CollectionName}>
        {dbVerses.map((verse, index) => (
          <ScriptureEntry
            key={index}
            translations={['NKJV']}
            book={verse.book as number}
            chapter={verse.chapter}
            verseNumbers={[verse.verseNumber]}
          />
        ))}
        <Button
          title="Add Verse"
          onPress={() => {
            setShowAddVerseOverlay(true);
          }}
        />
        <Overlay
          isVisible={showAddVerseOverlay}
          onBackdropPress={() => setShowAddVerseOverlay(false)}
          overlayStyle={{
            padding: 20,
            borderWidth: 1,
            borderColor: 'black',
            backgroundColor: 'white',
            width: '80%',
          }}>
          <PickerComponent
            label="Book:"
            items={allBooks}
            onSelect={(e) => handleInputChange('Book', e)}
            selectedValue={newVerse.Book}
          />
          {bookSelected && (
            <PickerComponent
              label="Chapter:"
              items={bookChapters}
              onSelect={(e) => handleInputChange('Chapter', e)}
              selectedValue={newVerse.Chapter}
            />
          )}
          {chapterSelected && (
            <RangePicker
              key={`${newVerse.Book}-${newVerse.Chapter}`}
              label="Verse:"
              finalNumber={chapterVerseCount}
              onSelectRange={(rangeString) => {
                handleInputChange('Verse', rangeString);
              }}
            />
          )}
          <Button title="Add" disabled={!newVerse.Verse} onPress={handleAddVerse} />
        </Overlay>
      </ScreenContent>
    </Container>
  );
}
