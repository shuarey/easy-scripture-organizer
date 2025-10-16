import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Button } from 'react-native';
import { bookDict } from 'services/translationDictionaryService';

import { Container } from 'components/Container';
import { PickerComponent } from 'components/Picker';
import { ScreenContent } from 'components/ScreenContent';
import RenderHtml from 'components/RenderHtml';

type RootStackParamList = {
  Home: undefined;
  CollectionDetail: { CollectionName: string };
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [selectedCollection, setSelectedCollection] = useState("");

  bookDict.setBooks(["WLCC", "NKJV", "ASV", "TR"]);

  const handleSelect = (value: string) => {
    setSelectedCollection(value);
  }
  
  return (
    <Container>
      <ScreenContent>
        <PickerComponent label='' onSelect={handleSelect}/>
        <Button title="Load Verses" onPress={
          () => navigation.navigate('CollectionDetail', { CollectionName: selectedCollection })
        } />
      </ScreenContent>
    </Container>
  );
}