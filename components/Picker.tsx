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
    console.log('PickerComponent mounted');
  }, []);
  
  return (
    <View>
      <Text className="text-lg mb-2">{label}</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleValueChange}
          itemStyle={{ fontSize: 20, height: 200 }}
        >
          <Picker.Item label="Stock verses" value="Stock Collection" />
          <Picker.Item label="Building a house" value="Building Collection" />
          <Picker.Item label="Spiritual warfare" value="Spiritual Warfare Collection" />
          <Picker.Item label="Healing" value="Healing Collection" />
          <Picker.Item label="Weird stuff" value="Weird Collection" />
        </Picker>
    </View>
  );
};
