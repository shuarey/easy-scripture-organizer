import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';

type PickerComponentProps = {
  label: string;
  onSelect: (value: string) => void;
};

export const PickerComponent = ({ label, onSelect }: PickerComponentProps) => {
  const [selectedValue, setSelectedValue] = useState("");
  
  const handleValueChange = (itemValue: string) => {
    setSelectedValue(itemValue);
    onSelect(itemValue);
  };

  useEffect(() => {
    //should load collections from a data source
  }, []);
  
  return (
    <View>
      <Text className="text-lg mb-2">{label}</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleValueChange}
          itemStyle={{ fontSize: 20, height: 200 }}
        >
          <Picker.Item label="Select a collection" value="" />
          <Picker.Item label="Stock verses" value="Stock verses" />
          <Picker.Item label="Building a house" value="Building a house" />
          <Picker.Item label="Spiritual warfare" value="Spiritual warfare" />
          <Picker.Item label="Healing" value="Healing" />
          <Picker.Item label="Weird stuff" value="Weird stuff" />
        </Picker>
    </View>
  );
};
