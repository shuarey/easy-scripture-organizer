import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StrictMode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BookProvider } from './context/dictionaryContext';
import { SQLiteProvider } from 'expo-sqlite';
import { databaseProps } from 'database/database';
import './global.css';
import CollectionDetail from './pages/CollectionDetail';
import HomeScreen from './pages/Home';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      // options: { title: 'Home' }
    },
    CollectionDetail: {
      screen: CollectionDetail,
      options: ({ route }: { route: { params?: { CollectionName?: string } } }) => ({
        title: route.params?.CollectionName
      }),
      initialParams: { CollectionName: 'Default Collection' }
    }
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return (
    <StrictMode>
      <SafeAreaProvider>
        <SQLiteProvider {...databaseProps}>
          <BookProvider>
            <Navigation />
          </BookProvider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </StrictMode>
  );
}
