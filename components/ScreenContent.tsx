import { ScrollView, TouchableOpacity, View, Text, LayoutChangeEvent } from 'react-native';
import { Header as HeaderRNE, ListItem, Overlay } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';

type ScreenContentProps = {
  children?: React.ReactNode;
  title?: string; 
};

type RootStackParamList = {
  Home: undefined;
  CollectionView: { CollectionName: string };
  CollectionListView: undefined;
};

export const ScreenContent = ({ children, title }: ScreenContentProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [headerBottomY, setHeaderBottomY] = useState<number>(0);
  const menuButtonRef = useRef<View>(null);

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    setHeaderBottomY(y + height);
  };

  const handleMenuPress = () => {
    if (!menuOpen && menuButtonRef.current) {
      menuButtonRef.current.measureInWindow((x, y, width, height) => {
        setMenuPosition({ x, y, width, height });
        setMenuOpen(true);
      });
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <View onLayout={handleHeaderLayout}>
        <HeaderRNE
          containerStyle={{ height: 80 }}
          backgroundColor=''
          leftComponent={
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <MaterialIcons name="home" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          }
          centerComponent={
            <Text style={{ color: 'white', fontSize: 20 }}>{title ?? 'VerseMark'}</Text>
          }
          rightComponent={
            <View ref={menuButtonRef}>
              <TouchableOpacity onPress={handleMenuPress}>
                <MaterialIcons name={menuOpen ? 'menu-open' : 'menu'} size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      <ScrollView className="p-4">
        {menuOpen && (
          <Overlay
            isVisible={menuOpen}
            onBackdropPress={() => setMenuOpen(false)}
            overlayStyle={{
              position: 'absolute',
              top: headerBottomY,
              left: menuPosition ? menuPosition.x - 150 : '10%',
              width: 200,
              padding: 0,
            }}
          >
            <ListItem>
              <ListItem.Content>
                <TouchableOpacity onPress={() => {
                      navigation.navigate('CollectionListView');
                      setMenuOpen(false);
                    }}>
                  <ListItem.Title className='font-bold'>Collections</ListItem.Title>
                </TouchableOpacity>
                <ListItem.Subtitle className='text-gray-500'>View and edit your collections</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <ListItem.Title className='font-bold'>Settings</ListItem.Title>
                <ListItem.Subtitle className='text-gray-500'>App settings and preferences</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          </Overlay>
        )}
        {children}
      </ScrollView>
    </>
  );
};
