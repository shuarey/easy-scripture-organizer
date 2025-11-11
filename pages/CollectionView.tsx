import { Container } from 'components/Container';
import { ScreenContent } from 'components/ScreenContent';
import ScriptureEntry from 'components/ScriptureEntry';
import { useEffect, useState } from 'react';
import { getVersesByCollectionId, insertVerse } from 'services/dbVerseService';
import { useSQLiteContext } from 'expo-sqlite';
import { LoadingScreen } from 'components/LoadingScreen';
import { Button } from '@rneui/themed';
import { Input, Overlay } from '@rneui/base';
import { insertCollectionVerse } from 'services/dbCollectionVerseService';
import { PickerComponent } from 'components/Picker';

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
  
  const [ dbVerses, setDbVerses ] = useState<{
    book: string | number;
    chapter: number;
    verseNumber: number;
  }[]>([]);

  const [ newVerse, setNewVerse ] = useState<{
    Book: number;
    Chapter: number;
    Verse: string;
  }>({ Book: 0, Chapter: 0, Verse: ""});

  const [translationBooks, setTranslationBooks] = useState<{
    id: number;
    text: string;
  }[]>([]);

  const { CollectionName, CollectionKey } = route.params;

  const [ loading, setLoading ] = useState(true);
  const [ showAddVerseOverlay, setShowAddVerseOverlay ] = useState(false);
  
  useEffect( () => {
    setLoading(true);
    getVersesByCollectionId(db, CollectionKey).then((verses) => {
      setDbVerses(verses);
    }).finally(() => setLoading(false));
  },[]);

  function handleInputChange (key: string, value: string | number){
    setNewVerse({
      ...newVerse, 
      [key]: value
    })
  }

  async function handleAddVerse() {
    await insertVerse(db, newVerse.Book, newVerse.Chapter, newVerse.Verse ).then((verseID) => {
      insertCollectionVerse(db, CollectionKey, verseID as number, "NKJV");
    }
    ).finally(() => setShowAddVerseOverlay(false));
  }
  
  if (loading) return <LoadingScreen />;

  return (
    <Container>
      <ScreenContent title={CollectionName}>
        {dbVerses.map( (verse, index) => (
          <ScriptureEntry 
            key={index}
            translations={["NKJV"]}
            book={verse.book as number}
            chapter={verse.chapter}
            verseNumbers={[verse.verseNumber]}
          />
        ))}
        <Button title="Add Verse" onPress={() => {setShowAddVerseOverlay(true)}} />
        <Overlay 
          isVisible={showAddVerseOverlay} 
          onBackdropPress={() => setShowAddVerseOverlay(false)}
          overlayStyle={{ padding: 20, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', width: '80%' }}>
            <PickerComponent
              label="Select Book:"
              items={translationBooks}
              onSelect={(e) => handleInputChange("Book", e)}
              selectedValue={newVerse.Book}
            />
            {/* <Input placeholder="Book" onChangeText={(e) => handleInputChange("Book", e)}/> */}
            <Input placeholder="Chapter" onChangeText={(e) => handleInputChange("Chapter", e)}/>
            <Input placeholder="Verse" onChangeText={(e) => handleInputChange("Verse", e)}/>
            <Button title="Add" onPress={handleAddVerse} />
        </Overlay>
      </ScreenContent>
    </Container>
  );
}


