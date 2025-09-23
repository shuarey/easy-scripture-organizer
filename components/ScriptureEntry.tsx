import { useState } from 'react';
import { Text, View } from 'react-native';
import { getParallelVerses } from '../api/api';

type ScriptureEntryProps = {
  translations?: string[];
  book?: number;
  chapter?: number;
  verseNumbers?: number[];
};

export const ScriptureEntry = ({ translations, book, chapter, verseNumbers = [] }: ScriptureEntryProps) => {

  const [verseText, setVerseText] = useState("");
  console.log("constructing ScriptureEntry object");
  getParallelVerses(translations, book, chapter, verseNumbers).then((resText) => {
    console.log("Received verse text:", resText);
    setVerseText(resText[0][0].text); // Example: setting to the text of the first verse of the first translation
  });

  return (
    <View className="items-start">
      <Text className="font-bold">Genesis 1:1</Text>
      <Text>{verseText}</Text>
    </View>
  );
};
