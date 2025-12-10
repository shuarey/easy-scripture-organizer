import { Container } from 'components/Container';
import { ActivityIndicator } from 'react-native';

export const LoadingScreen = () => {
  return (
    <Container>
      <ActivityIndicator size="large" color="#0000ff" />
    </Container>
  );
};
