import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Button } from 'react-native-elements';

import { getVersesByCollectionId } from 'services/dbVerseService';
import AddEditVerse from 'components/AddEditVerse';

import { LoadingScreen } from 'components/LoadingScreen';
import { Container } from 'components/Container';
import { ScreenContent } from 'components/ScreenContent';
import ScriptureEntry from 'components/ScriptureEntry';

import { Verse } from 'models/models';

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

  const [dbVerses, setDbVerses] = useState<Verse[]>([]);

  const { CollectionName, CollectionKey } = route.params;
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [editorVisible, setEditorVisible] = useState(false);
  const [editorMode, setEditorMode] = useState<'add' | 'edit'>('add');
  const [editorInitial, setEditorInitial] = useState<{
    Book: number;
    Chapter: number;
    Verse: string;
  } | null>(null);
  const [editorTarget, setEditorTarget] = useState<Verse | null>(null);

  useEffect(() => {
    setLoading(true);
    getVersesByCollectionId(db, CollectionKey)
      .then((verses) => {
        setDbVerses(verses);
      })
      .finally(() => setLoading(false));
  }, [refetchTrigger]);

  if (loading) return <LoadingScreen />;

  return (
    <Container>
      <ScreenContent title={CollectionName} scrollViewEnabled={true}>
        {dbVerses.map((verse, index) => (
          <ScriptureEntry
            key={index}
            translations={['NKJV']}
            book={verse.book as number}
            chapter={verse.chapter}
            verseNumbers={verse.verseNumber}
            verseNumberRaw={verse.verseNumberRaw || ''}
            onLongPress={() => {
              setEditorMode('edit');
              setEditorTarget(verse);
              setEditorInitial({
                Book: Number(verse.book),
                Chapter: verse.chapter,
                Verse: verse.verseNumberRaw || '',
              });
              setEditorVisible(true);
            }}
          />
        ))}
        <Button
          title="Add Verse"
          onPress={() => {
            setEditorMode('add');
            setEditorTarget(null);
            setEditorInitial({ Book: 0, Chapter: 0, Verse: '' });
            setEditorVisible(true);
          }}
        />
        <AddEditVerse
          visible={editorVisible}
          mode={editorMode}
          onClose={() => setEditorVisible(false)}
          onDone={() => {
            setRefetchTrigger((p) => p + 1);
            setEditorVisible(false);
          }}
          initial={editorInitial ?? undefined}
          collectionKey={CollectionKey}
          targetVerseId={editorTarget?.pk}
        />
      </ScreenContent>
    </Container>
  );
}
