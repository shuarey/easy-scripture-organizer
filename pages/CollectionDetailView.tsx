import { Container } from "components/Container";
import { ScreenContent } from "components/ScreenContent";
import { useEffect, useState } from 'react';
import { deleteCollection, getCollectionById, insertCollection } from "services/dbCollectionService";
import { useSQLiteContext } from "expo-sqlite";
import { LoadingScreen } from "components/LoadingScreen";
import { Input, Button, Overlay } from '@rneui/themed';
import { View, Text } from "react-native";
import { Separator } from "components/Separator";
import { updateCollection } from "services/dbCollectionService";
import { Collection } from "models/models";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  CollectionListView: { slideDirection: string };
};

type CollectionProps = {
  route: {
    params: {
      collectionId?: number;
    };
  };
};

export default function CollectionDetailView({ route }: CollectionProps) {
  const db = useSQLiteContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { collectionId } = route.params;

  const [loading, setLoading] = useState(true);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [collection, setCollection] = useState<Collection | null>(null);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    if (!collectionId) {
      setLoading(false);
      return;
    }
    getCollectionById(db, collectionId!)
      .then((data) => {
        setCollection(data);
        setName(data?.name ?? '');
        setDescription(data?.description ?? '');
      }).then(() => {
        updateCollection(db, collection as Collection);
      })
      .finally(() => setLoading(false));
  }, [collectionId]);

  const handleSaveChanges = () => {
    if (name.trim() === '') {
      setShowErrorOverlay(true);
      return;
    }

    if (collection) {
      const updated: Collection = { ...collection, name, description } as Collection;
      updateCollection(db, updated)
        .then(() => {
          setCollection(updated);
          setShowSuccessOverlay(true);
        });
    }
    else{
      const newCollection: Omit<Collection, 'id' | 'created_at'> = {
        name,
        description
      };
      insertCollection(db, newCollection)
        .then(() => {
          setCollection(newCollection as Collection);
          setShowSuccessOverlay(true);
        });
    }
  };

  const handleDeleteCollection = () => {
    if (collection) {
      deleteCollection(db, collection.id)
        .then(() => {
          setShowSuccessOverlay(true);
        });
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <Container>
      <ScreenContent title="Collection Details">
        <Input 
          placeholder="Collection Name" 
          value={name}
          onChangeText={setName}
          />
        <Input placeholder="Collection Description" value={description} onChangeText={setDescription} />
        <View className="flex-auto">
          <Button title={`Save ${collectionId ? 'Changes' : 'Collection'}`} onPress={() => { handleSaveChanges() }} />
          {collectionId && (
            <>
              <Separator />
              <Button title="Delete Collection" color="#f55347" onPress={() => { handleDeleteCollection() }} />
            </>
          )}
        </View>
        <Overlay
          isVisible={showSuccessOverlay}
          onBackdropPress={() => setShowSuccessOverlay(false)}
          onDismiss={() => navigation.navigate('CollectionListView', { slideDirection: 'left' })}>
          <Ionicons name="checkmark-circle" color="black" size={48} />
        </Overlay>
        <Overlay
          isVisible={showErrorOverlay}
          onBackdropPress={() => setShowErrorOverlay(false)}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Error</Text>
            <Text style={{ fontSize: 16 }}>Collection Name cannot be empty.</Text>
          </View>
        </Overlay>
      </ScreenContent>
    </Container>
  );
}