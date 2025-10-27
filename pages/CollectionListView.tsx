import { ListItem } from "@rneui/base";
import { Container } from "components/Container";
import { ScreenContent } from "components/ScreenContent";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { getAllCollections } from "services/dbCollectionService";
import { LoadingScreen } from "components/LoadingScreen";

type RootStackParamList = {
  CollectionDetailView: { collectionId: number };
};

export default function CollectionListView() {
  const db = useSQLiteContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [loading, setLoading] = useState(true);
  const [dbCollections, setDbCollections] = useState<{
    id: number;
    text: string;
    description: string;
  }[]>([]);

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

  if (loading) return <LoadingScreen />;

  return (
    <Container>
      <ScreenContent title="Collections">
        {dbCollections.map((collection: { id: any; text: any; description: any; }) => (
          <ListItem key={collection.id}>
            <ListItem.Content>
                <TouchableOpacity onPress={() => {navigation.navigate('CollectionDetailView', { collectionId: collection.id })}}>
                    <ListItem.Title className='font-bold'>{collection.text}</ListItem.Title>
                    <ListItem.Subtitle className='text-gray-500'>{collection.description}</ListItem.Subtitle>
                </TouchableOpacity>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScreenContent>
    </Container>
  );
};
