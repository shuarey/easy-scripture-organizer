import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import { PickerComponent } from './Picker';
import { RangePicker } from './RangePicker';

import BookChapterVerseCountJSON from '../assets/BookChapterVerseCount.json';
import { useSQLiteContext } from 'expo-sqlite';
import { insertVerse } from 'services/dbVerseService';
import {
  insertCollectionVerse,
  deleteCollectionVerseByVerseId,
} from 'services/dbCollectionVerseService';

type Mode = 'add' | 'edit';

type Props = {
  visible: boolean;
  mode: Mode;
  onClose: () => void;
  onDone?: () => void;
  initial?: { Book: number; Chapter: number; Verse: string };
  collectionKey: number;
  targetVerseId?: number;
};

export const AddEditVerse = ({
  visible,
  mode,
  onClose,
  onDone,
  initial,
  collectionKey,
  targetVerseId,
}: Props) => {
  const db = useSQLiteContext();
  const [values, setValues] = useState<{ Book: number; Chapter: number; Verse: string }>(
    initial ?? { Book: 0, Chapter: 0, Verse: '' }
  );

  const [bookList, setBookList] = useState<{ id: number; text: string }[]>([]);
  const [chapterList, setChapterList] = useState<{ id: number; text: string }[]>([]);
  const [finalNumber, setFinalNumber] = useState<number>(0);
  const [initialVerse, setInitialVerse] = useState<{ start: number; end: number } | undefined>(
    undefined
  );

  useEffect(() => {
    setBookList(
      Object.entries(BookChapterVerseCountJSON).map(([key, value]) => ({
        id: parseInt(key) + 1,
        text: value.Name,
      }))
    );
  }, []);

  useEffect(() => {
    setValues(initial ?? { Book: 0, Chapter: 0, Verse: '' });
    setInitialVerse(undefined);
    if (initial && initial.Verse) {
      const [start, end] = initial.Verse.split('-').map((n) => parseInt(n));
      setInitialVerse({ start, end });
    }
  }, [initial, visible, mode]);

  useEffect(() => {
    const bookId = values.Book;
    if (!bookId || bookId === 0) {
      setChapterList([]);
      setFinalNumber(0);
      return;
    }
    const chapters = BookChapterVerseCountJSON[bookId - 1]?.Chapters || [];
    setChapterList(
      chapters.map((chap: any, index: number) => ({
        id: chap?.Id ?? index + 1,
        text: `${chap?.Id ?? index + 1}`,
      }))
    );
    const chapterObj = BookChapterVerseCountJSON[bookId - 1]?.Chapters?.[values.Chapter - 1];
    const verseCount = typeof chapterObj === 'number' ? chapterObj : (chapterObj?.Verses ?? 0);
    setFinalNumber(verseCount);
  }, [values.Book, values.Chapter]);

  function handleInputChange(key: string, value: string | number) {
    setValues((prev) => ({ ...prev, [key]: value }) as any);
  }

  async function handleSave() {
    console.log(`editorMode: ${mode}, targetVerseId: ${targetVerseId}`);
    try {
      if (mode === 'add') {
        const verseID = await insertVerse(db, values.Book, values.Chapter, values.Verse);
        await insertCollectionVerse(db, collectionKey, verseID as number, 'NKJV');
      } else if (mode === 'edit' && targetVerseId) {
        const newVerseId = await insertVerse(db, values.Book, values.Chapter, values.Verse);
        await insertCollectionVerse(db, collectionKey, newVerseId as number, 'NKJV');
        await deleteCollectionVerseByVerseId(db, collectionKey, targetVerseId);
      }

      if (onDone) onDone();
    } catch (err) {
      console.error('AddEditVerse save failed', err);
    } finally {
      onClose();
    }
  }

  async function handleDelete() {
    console.log(targetVerseId);
    try {
      if (targetVerseId) {
        await deleteCollectionVerseByVerseId(db, collectionKey, targetVerseId);
        if (onDone) onDone();
      }
    } catch (err) {
      console.error('AddEditVerse delete failed', err);
    } finally {
      onClose();
    }
  }

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={onClose}
      overlayStyle={{
        padding: 20,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        width: '80%',
      }}>
      <View>
        <PickerComponent
          label="Book:"
          items={bookList}
          onSelect={(e) => handleInputChange('Book', e)}
          selectedValue={values.Book}
        />

        {values.Book !== 0 && (
          <PickerComponent
            label="Chapter:"
            items={chapterList}
            onSelect={(e) => handleInputChange('Chapter', e)}
            selectedValue={values.Chapter}
          />
        )}

        {values.Chapter !== 0 && (
          <RangePicker
            key={`${values.Book}-${values.Chapter}`}
            label="Verse:"
            finalNumber={finalNumber}
            initialState={
              initialVerse ? { start: initialVerse.start, end: initialVerse.end } : undefined
            }
            onSelectRange={(rangeString) => handleInputChange('Verse', rangeString)}
          />
        )}

        <View style={{ marginTop: 16 }}>
          {mode === 'add' ? (
            <Button title="Add" onPress={handleSave} disabled={!values.Verse} />
          ) : (
            <View>
              <Button title="Save" onPress={handleSave} disabled={!values.Verse} />
              <View style={{ height: 8 }} />
              <Button
                title="Delete"
                buttonStyle={{ backgroundColor: '#f55347' }}
                onPress={handleDelete}
              />
            </View>
          )}
        </View>
      </View>
    </Overlay>
  );
};

export default AddEditVerse;
