import { Container } from "components/Container";
import { ScreenContent } from "components/ScreenContent";
import { useEffect, useState } from 'react';
import { deleteCollection, getCollectionById } from "services/dbCollectionService";
import { useSQLiteContext } from "expo-sqlite";
import { LoadingScreen } from "components/LoadingScreen";
import { Input, Button, Overlay } from '@rneui/themed';
import { View, Text } from "react-native";
import { Separator } from "components/Separator";
import { updateCollection } from "services/dbCollectionService";
import { Collection } from "models/models";

type CollectionProps = {
  route: {
    params: {
      collectionId: number;
    };
  };
};

export default function CollectionDetailView({ route }: CollectionProps) {
  const db = useSQLiteContext();
  const { collectionId } = route.params;
  const [loading, setLoading] = useState(true);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [collection, setCollection] = useState<Collection | null>(null);

  // local controlled inputs so RNE Input components remain editable
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    getCollectionById(db, collectionId)
      .then((data) => {
        setCollection(data);
        setName(data?.name ?? '');
        setDescription(data?.description ?? '');
      })
      .finally(() => setLoading(false));
  }, [db, collectionId]);

  const handleSaveChanges = () => {
    if (collection) {
      const updated: Collection = { ...collection, name, description } as Collection;
      updateCollection(db, updated)
        .then(() => {
          setCollection(updated);
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

  if (showSuccessOverlay) {
    return (
      <Overlay isVisible={true} onBackdropPress={() => setShowSuccessOverlay(false)}>
        <Text>Changes saved successfully!</Text>
      </Overlay>
    )
  }

  return (
    <Container>
        <ScreenContent title="Collection Details">
          <Input placeholder="Collection Name" value={name} onChangeText={setName} />
          <Input placeholder="Collection Description" value={description} onChangeText={setDescription} />
          <View className="flex-auto">
            <Button title="Save Changes" onPress={() => {handleSaveChanges()}} />
            <Separator />
            <Button title="Delete Collection" color="#f55347" onPress={() => {handleDeleteCollection()}} />
          </View>
        </ScreenContent>
    </Container>
  );
}