import { ScrollView } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';

type ScreenContentProps = {
  children?: React.ReactNode;
};

export const ScreenContent = ({ children }: ScreenContentProps) => {
  return (
    <>
      <HeaderRNE
        containerStyle={{ bottom: 15, height: 60 }}
        leftComponent={{ icon: 'menu', color: '#fff', size: 20 }}
      />
      <ScrollView className='p-4'>
        {children}
      </ScrollView>
    </>
  );
};