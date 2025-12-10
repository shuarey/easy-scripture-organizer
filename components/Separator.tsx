import { View } from 'react-native';

type ScriptureEntryProps = {
  color?: string;
};

export const Separator = ({ color }: ScriptureEntryProps) => {
  return <View className={`mx-auto my-7 h-[1px] w-4/5 ${color || 'bg-gray-200'}`} />;
};
