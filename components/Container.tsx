import { View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <View className='flex flex-1 bg-white'>{children}</View>;
};