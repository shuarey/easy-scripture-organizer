import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StrictMode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BookProvider } from './context/bookContext';
import { LanguageProvider } from './context/languageContext';

import { SQLiteProvider } from 'expo-sqlite';
import { databaseProps } from 'database/database';

import './global.css';

import CollectionView from './pages/CollectionView';
import HomeScreen from './pages/Home';
import CollectionListView from './pages/CollectionListView';
import CollectionDetailView from './pages/CollectionDetailView';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: () => ({
        animation: 'slide_from_left',
        headerShown: false,
      })},
    CollectionView: {
      screen: CollectionView,
      options: ({ route }: { route: { params?: { CollectionName?: string; CollectionKey?: number } } }) => ({
        animation: 'slide_from_right',
        title: route.params?.CollectionName,
        headerShown: false,
      })
    },
    CollectionListView: {
      screen: CollectionListView,
      options: ({ route }: { route: { params?: { slideDirection?: string } } }) => ({
        animation: route.params?.slideDirection === 'left' ? 'slide_from_left' : 'slide_from_right',
        headerShown: false,
      })
    },
    CollectionDetailView: {
      screen: CollectionDetailView,
      options: ({ route }: { route: { params?: { collectionId?: number } } }) => ({
        animation: 'slide_from_right',
        headerShown: false,
      })
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return (
    <StrictMode>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SQLiteProvider {...databaseProps}>
            <LanguageProvider>
              <BookProvider>
                <Navigation />
              </BookProvider>
            </LanguageProvider>
          </SQLiteProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </StrictMode>
  );
}
