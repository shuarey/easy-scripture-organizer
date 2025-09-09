import { Text, View } from 'react-native';

type ScriptureEntryProps = {
  verse: string;
  text: string;
};

export const ScriptureEntry = ({ verse, text }: ScriptureEntryProps) => {
  return (
    <View className="items-start">
      <Text className="font-bold">{verse}</Text>
      <Text>{text}</Text>
    </View>
  );
};
