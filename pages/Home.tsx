import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Button } from 'react-native';
import { bookDict } from 'services/translationDictionaryService';

import { Container } from 'components/Container';
import { PickerComponent } from 'components/Picker';
import { ScreenContent } from 'components/ScreenContent';
import { getAllCollections } from 'services/dbCollectionService';
import { useSQLiteContext } from 'node_modules/expo-sqlite/build/hooks';
import { LoadingScreen } from 'components/LoadingScreen';

type RootStackParamList = {
  Home: undefined;
  CollectionDetail: { CollectionName: string };
};

export default function HomeScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [dbCollections, setDbCollections] = useState<{
    id: number;
    text: string;
    description: string;
  }[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState("");

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

  const handleSelect = (value: string) => {
    setSelectedCollection(value);
  }

  if (loading) {
    return (
      <LoadingScreen />
    );
  }
  
  return (
    <Container>
      <ScreenContent>
        <PickerComponent 
          label='Select a collection' 
          items={dbCollections} 
          onSelect={handleSelect}
          selectedValue={selectedCollection}
        />
        <Button title="Load Verses" onPress={
          () => navigation.navigate('CollectionDetail', { CollectionName: selectedCollection })
        } />
      </ScreenContent>
    </Container>
  );
}