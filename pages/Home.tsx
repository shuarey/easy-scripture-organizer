import { useState } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ScreenContent } from 'components/ScreenContent';
import { Container } from 'components/Container';
import { PickerComponent } from 'components/Picker';

type RootStackParamList = {
  Home: undefined;
  CollectionDetail: { CollectionName: string };
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [selectedCollection, setSelectedCollection] = useState("");

  const handleSelect = (value: string) => {
    console.log('Selected collection:', value);
    setSelectedCollection(value);
  }
  return (
    <Container>
      <ScreenContent>
        <PickerComponent label="Select a collection:" onSelect={handleSelect}/>
        <Button title="Load Verses" onPress={() => navigation.navigate('CollectionDetail', { CollectionName: selectedCollection })} />
      </ScreenContent>
    </Container>
  );
}