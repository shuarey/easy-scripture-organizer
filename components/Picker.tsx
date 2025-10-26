import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type PickerComponentProps = {
  label: string;
  items: { id: number; text: string; description: string }[];
  onSelect: (value: string) => void;
  selectedValue: string;
};

export const PickerComponent = ({ label, items, onSelect, selectedValue }: PickerComponentProps) => {

  return (
    <View>
      <Text className="text-lg mb-2">{label}</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onSelect(itemValue)}
          itemStyle={{ fontSize: 20, height: 200 }}
        >
          <Picker.Item label="--Select--" value="" />
          {items.map((item) => (
            <Picker.Item key={item.id} label={item.text} value={item.text} />
          ))}
        </Picker>
    </View>
  );
};
