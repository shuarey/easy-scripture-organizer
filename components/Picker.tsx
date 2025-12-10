import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Input } from 'react-native-elements';

type PickerComponentProps = {
  label: string;
  items: { id: number; text: string; description?: string }[];
  onSelect: (key: number, value: string) => void;
  selectedValue: number | string;
  style?: string;
  enabled?: boolean;
};

export const PickerComponent = ({
  label,
  items,
  onSelect,
  selectedValue,
  style = 'text-lg mb-2',
  enabled = true,
}: PickerComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (selectedValue === 0) {
      setDisplayText('');
      return;
    }
    const found = items.find((i) => i.id === Number(selectedValue));
    setDisplayText(found ? found.text : String(selectedValue));
  }, [selectedValue, items]);

  const handleSelect = (itemValue: number | string) => {
    const id = Number(itemValue);
    const found = items.find((i) => i.id === id);

    const text = found ? found.text : String(itemValue);

    if (itemValue === 0) {
      setDisplayText('');
    } else {
      setDisplayText(text);
    }

    onSelect(id, text);
    setIsOpen(false);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text className={style}>{label}</Text>
      {!isOpen && (
        <TouchableOpacity onPress={() => setIsOpen(true)}>
          <Input
            value={displayText}
            placeholder="--Select--"
            editable={false}
            disabled={!enabled}
            pointerEvents="none"
            rightIcon={{ name: 'arrow-drop-down', type: 'material' }}
          />
        </TouchableOpacity>
      )}
      {isOpen && (
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleSelect}
          itemStyle={{ fontSize: 20, color: 'black', height: 200 }}
          enabled={enabled}>
          <Picker.Item key={0} label="---" value={0} />
          {items.map((item) => (
            <Picker.Item key={item.id} label={item.text} value={item.id} />
          ))}
        </Picker>
      )}
    </View>
  );
};
