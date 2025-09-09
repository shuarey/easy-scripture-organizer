import { View } from 'react-native';

type ScriptureEntryProps = {
  color?: string;
};

export const Separator = ({ color }: ScriptureEntryProps) => {
  return (
    <View className={`h-[1px] my-7 w-4/5 mx-auto ${color || 'bg-gray-200'}`} />
  );
};
