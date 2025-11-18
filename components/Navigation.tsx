import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  CollectionView: { CollectionName: string; CollectionKey: number };
  CollectionListView?: { slideDirection: string };
  CollectionDetailView: { collectionId: number };
  SettingsScreen: undefined;
};

export type AppNavigation = NativeStackNavigationProp<RootStackParamList>;

export function useAppNavigation() {
  return useNavigation<AppNavigation>();
}