import { ScrollView, TouchableOpacity, View, Text, LayoutChangeEvent } from 'react-native';
import { Header as HeaderRNE, ListItem, Overlay } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { useAppNavigation } from './Navigation';

type ScreenContentProps = {
  children?: React.ReactNode;
  title?: string; 
  scrollViewEnabled?: boolean;
};

export const ScreenContent = ({ children, title, scrollViewEnabled }: ScreenContentProps) => {
  const isDebugMode = process.env.NODE_ENV === 'development';
  const navigation = useAppNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [headerBottomY, setHeaderBottomY] = useState<number>(0);
  const menuButtonRef = useRef<View>(null);
  const db = useSQLiteContext();

  const [shareDbModule, setShareDbModule] = useState(null);
  const [shareDbFunc, setShareDbFunc] = useState(null);

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
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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

      {scrollViewEnabled ? (
      <ScrollView className="p-4">
        {menuOpen && (
          <Overlay
            isVisible={menuOpen}
            onBackdropPress={() => setMenuOpen(false)}
            overlayStyle={{
              position: 'absolute',
              top: headerBottomY,
              left: menuPosition!.x - 300,
              width: 300,
              borderRadius: 8
            }}
          >
            <ListItem>
              <ListItem.Content>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('CollectionListView');
                    setMenuOpen(false);
                  }}>
                  <ListItem.Title className='font-bold'>Collections</ListItem.Title>
                  <ListItem.Subtitle className='text-gray-500'>View and edit your collections</ListItem.Subtitle>
                </TouchableOpacity>
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('SettingsScreen');
                    setMenuOpen(false);
                  }}>
                  <ListItem.Title className='font-bold'>Settings</ListItem.Title>
                  <ListItem.Subtitle className='text-gray-500'>App settings and preferences</ListItem.Subtitle>
                </TouchableOpacity>
              </ListItem.Content>
            </ListItem>
            {isDebugMode && 
              <ListItem>
                <ListItem.Content>
                  <TouchableOpacity onPress={async () => {
                    try {
                        if (shareDbModule && shareDbFunc){
                          // this doesn't work at the moment. app needs a reload if I want
                          // to do this more than once.
                          // await shareDbFunc;
                        }
                        else{
                          const module = await import('./ShareDbFile');
                          setShareDbModule(module as any);
                          const shareFunc = (module as any).shareDbFile;
                          setShareDbFunc(() => shareFunc((db as any).database));
                          await shareFunc((db as any).databasePath);
                        }
                      } catch (err) {
                        console.error('Failed to send DB file', err);
                      } finally {
                        setMenuOpen(false);
                      }
                    }}>
                    <ListItem.Title className='font-bold'>Send db file</ListItem.Title>
                    <ListItem.Subtitle className='text-gray-500'>Email database file</ListItem.Subtitle>
                  </TouchableOpacity>
                </ListItem.Content>
              </ListItem>
            }
          </Overlay>
        )}
        {children}
      </ScrollView>
      ) : (
      <View className="flex-1 p-4">
        {menuOpen && (
          <Overlay
            isVisible={menuOpen}
            onBackdropPress={() => setMenuOpen(false)}
            overlayStyle={{
              position: 'absolute',
              top: headerBottomY,
              left: menuPosition!.x - 300,
              width: 300,
              borderRadius: 8
            }}
          >
            <ListItem>
              <ListItem.Content>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('CollectionListView');
                    setMenuOpen(false);
                  }}>
                  <ListItem.Title className='font-bold'>Collections</ListItem.Title>
                  <ListItem.Subtitle className='text-gray-500'>View and edit your collections</ListItem.Subtitle>
                </TouchableOpacity>
              </ListItem.Content>
            </ListItem>
            <ListItem>
              <ListItem.Content>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('SettingsScreen');
                    setMenuOpen(false);
                  }}>
                  <ListItem.Title className='font-bold'>Settings</ListItem.Title>
                  <ListItem.Subtitle className='text-gray-500'>App settings and preferences</ListItem.Subtitle>
                </TouchableOpacity>
              </ListItem.Content>
            </ListItem>
            {isDebugMode && 
              <ListItem>
                <ListItem.Content>
                  <TouchableOpacity onPress={async () => {
                    try {
                        if (shareDbModule && shareDbFunc){
                          // this doesn't work at the moment. app needs a reload if I want
                          // to do this more than once.
                          // await shareDbFunc;
                        }
                        else{
                          const module = await import('./ShareDbFile');
                          setShareDbModule(module as any);
                          const shareFunc = (module as any).shareDbFile;
                          setShareDbFunc(() => shareFunc((db as any).database));
                          await shareFunc((db as any).databasePath);
                        }
                      } catch (err) {
                        console.error('Failed to send DB file', err);
                      } finally {
                        setMenuOpen(false);
                      }
                    }}>
                    <ListItem.Title className='font-bold'>Send db file</ListItem.Title>
                    <ListItem.Subtitle className='text-gray-500'>Email database file</ListItem.Subtitle>
                  </TouchableOpacity>
                </ListItem.Content>
              </ListItem>
            }
          </Overlay>
        )}
        {children}
      </View>
      )}
    </>
  );
};