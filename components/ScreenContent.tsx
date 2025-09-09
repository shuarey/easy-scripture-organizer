import { ScrollView } from 'react-native';

type ScreenContentProps = {
  children?: React.ReactNode;
};

export const ScreenContent = ({ children }: ScreenContentProps) => {
  return (
    <ScrollView className='p-4'>
      {children}
    </ScrollView>
  );
};