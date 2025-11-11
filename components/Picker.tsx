import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type PickerComponentProps = {
  label: string;
  items: { id: number; text: string; description?: string }[];
  onSelect: (key: number, value: string) => void;
  selectedValue: number | string;
};

export const PickerComponent = ({ label, items, onSelect, selectedValue }: PickerComponentProps) => {

  return (
    <View>
      <Text className="text-lg mb-2">{label}</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => {
            const id = Number(itemValue);
            const found = items.find(i => i.id === id);
            onSelect(id, found ? found.text : String(itemValue));
          }}
          itemStyle={{ fontSize: 20, color: 'black', height: 200 }}
          collapsable={true}
        >
          <Picker.Item key={0} label="--Select--" value={0} />
          {items.map((item) => (
            <Picker.Item key={item.id} label={item.text} value={item.id} />
          ))}
        </Picker>
    </View>
  );
};
