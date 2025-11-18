import { useEffect, useState } from 'react';
import { Button } from 'react-native';

import { bookDict } from 'services/bookDictionaryService';
import { getAllCollections } from 'services/dbCollectionService';

import { Container } from 'components/Container';
import { PickerComponent } from 'components/Picker';
import { LoadingScreen } from 'components/LoadingScreen';
import { ScreenContent } from 'components/ScreenContent';
import { useAppNavigation } from 'components/Navigation';

import { useSQLiteContext } from 'node_modules/expo-sqlite/build/hooks';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const navigation = useAppNavigation();

  const [dbCollections, setDbCollections] = useState<{
    id: number;
    text: string;
    description: string;
  }[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadVersesDisabled, setLoadVersesDisabled] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

  bookDict.setBooks(["WLCC", "NKJV", "ASV", "TR"]);

  useEffect(() => {
    setLoading(true);
    getAllCollections(db).then((collections) => {
      const formattedCollections = collections.map((collection) => ({
        id: collection.id,
        text: collection.name,
        description: collection.description
      }));
      setDbCollections(formattedCollections);
    })
    .finally(() => setLoading(false));
  }, []);

  const handleSelect = (key: number) => {
    setSelectedCollection(key === 0 ? null : key);
    if (key === 0) {
      setLoadVersesDisabled(true);
      return;
    }
    setLoadVersesDisabled(false);
  }

  if (loading) { return ( <LoadingScreen /> ); }
  
  return (
    <Container>
      <ScreenContent>
        <PickerComponent
          label=''
          items={dbCollections}
          onSelect={handleSelect}
          selectedValue={selectedCollection ?? 0}
        />
        <Button disabled={loadVersesDisabled} title="Load Verses" onPress={ () => {
          const selectedId = selectedCollection!;
          const selectedName = dbCollections.find(c => c.id === selectedId)?.text ?? '';
          navigation.navigate('CollectionView', { 
            CollectionName: selectedName, 
            CollectionKey: selectedId 
          });
        }
        } />
      </ScreenContent>
    </Container>
  );
}