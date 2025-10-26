import { Container } from 'components/Container';
import { ScreenContent } from 'components/ScreenContent';
import ScriptureEntry from 'components/ScriptureEntry';
import { Separator } from 'components/Separator';
import { useEffect, useState } from 'react';
import { getVerseByID } from 'services/dbVerseService';
import { useSQLiteContext } from 'expo-sqlite';
import { LoadingScreen } from 'components/LoadingScreen';

type CollectionDetailProps = {
  route: {
    params: {
      CollectionName: string;
    };
  };
};

export default function CollectionDetail({ route }: CollectionDetailProps) {
  const db = useSQLiteContext();
  const [ dbVerse, setDbVerse ] = useState<{
    book: number;
    chapter: number;
    verseNumber: number;
  }>({ book: 0, chapter: 0, verseNumber: 0 });
  
  const { CollectionName } = route.params;
  const { book: dbVerseBook, chapter: dbVerseChapter, verseNumber: dbVerseNumber } = dbVerse;
  const [ loading, setLoading ] = useState(true);
  
  useEffect( () => {
    setLoading(true);
    getVerseByID(db, 1).finally(() => setLoading(false))
    .then( (verse) => {
        setDbVerse({
          book: verse!.book,
          chapter: verse!.chapter,
          verseNumber: verse!.verseNumber
        })
      });
  },[]);

  if (loading) return <LoadingScreen />;

  return (
    <Container>
      <ScreenContent>
        {CollectionName === "Stock verses" && (
          <>
          {/* implement lazy loading here at some point. 
          The app simply crashes upon a large number of entries */}
          <ScriptureEntry translations={["WLCC", "NKJV", "ASV"]} book={dbVerseBook} chapter={1} verseNumbers={[1, 2]} />
          <Separator />
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={20} chapter={3} verseNumbers={[5,6]} />
          <Separator />
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={40} chapter={1} verseNumbers={[1]} />
          <Separator />
          <ScriptureEntry translations={["TR", "NKJV"]} book={43} chapter={3} verseNumbers={[16]} />
          <Separator />
          <ScriptureEntry translations={["TR", "NKJV"]} book={45} chapter={4} verseNumbers={[13]} />
          <Separator />
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={19} chapter={127} verseNumbers={[1]} />
          <Separator />
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={20} chapter={3} verseNumbers={[5, 6]} />
          </>
        )}
      </ScreenContent>
    </Container>
  );
}


