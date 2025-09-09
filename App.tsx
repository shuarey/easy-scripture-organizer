import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './pages/Home';
import CollectionDetail from './pages/CollectionDetail';
import './global.css';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: { title: 'Home' }
    },
    CollectionDetail: {
      screen: CollectionDetail,
      options: { title: 'Collection Detail' },
      initialParams: { CollectionName: 'Default Collection' }
    }
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
