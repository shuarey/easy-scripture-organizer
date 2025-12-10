import { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { PickerComponent } from './Picker';

type RangePickerProps = {
  label: string;
  finalNumber: number;
  onSelectRange?: (rangeString: string) => void;
  enabled?: boolean;
};

export const RangePicker = ({
  label,
  finalNumber,
  onSelectRange,
  enabled = true,
}: RangePickerProps) => {
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [rangeText, setRangeText] = useState<string>('');
  const [collapsed, setCollapsed] = useState(false);
  const labelStyle = 'text-sm text-center mt-2';

  const fullItems = useMemo(() => {
    return Array.from({ length: finalNumber }, (_, i) => ({
      id: i + 1,
      text: (i + 1).toString(),
    }));
  }, [finalNumber]);

  const limitedItems = useMemo(() => {
    if (!start) return [];
    return fullItems.filter((x) => x.id >= start);
  }, [start, fullItems]);

  const handleFinalize = (key: number) => {
    const newEnd = key;
    const effectiveStart = start ?? key;
    const range =
      effectiveStart && newEnd
        ? effectiveStart === newEnd
          ? `${effectiveStart}`
          : `${effectiveStart}-${newEnd}`
        : '';
    setEnd(newEnd);
    setRangeText(range);
    setCollapsed(true);
    if (onSelectRange) onSelectRange(range);
  };

  return (
    <View>
      {collapsed && (
        <TouchableOpacity onPress={() => setCollapsed(false)}>
          <Input
            label={label}
            value={rangeText}
            editable={false}
            disabled={true}
            rightIcon={{ name: 'edit', type: 'material' }}
          />
        </TouchableOpacity>
      )}

      {!collapsed && (
        <View>
          <Text>{label}</Text>
          <View className="flex-row gap-10">
            <View className="flex-1">
              <PickerComponent
                label="Start"
                items={fullItems}
                selectedValue={start ?? 0}
                enabled={enabled}
                style={labelStyle}
                onSelect={(key) => {
                  setStart(key);
                  if (end && key > end) {
                    setEnd(null);
                  }
                  if (key === finalNumber) {
                    handleFinalize(key);
                    return;
                  }
                  setEnd(null);
                }}
              />
            </View>

            <View className="flex-1">
              <PickerComponent
                label="End"
                items={limitedItems}
                selectedValue={end ?? 0}
                style={labelStyle}
                onSelect={(key) => {
                  if (!start) return;
                  handleFinalize(key);
                }}
                enabled={!!start && enabled}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
