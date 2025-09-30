import { useState } from 'react';
import { Text, View } from 'react-native';
import Books from './Books';
import { getParallelVerses } from '../api/api';

type ScriptureEntryProps = {
  translations: string[];
  book: number;
  chapter: number;
  verseNumbers: number[];
};

export const ScriptureEntry = ({ translations, book, chapter, verseNumbers }: ScriptureEntryProps) => {

  const [verseText, setVerseText] = useState("");
  console.log("constructing ScriptureEntry object");

  getParallelVerses(translations, book, chapter, verseNumbers).then((resText) => {
    const books = Books({ translations });
    console.log("First book name:", books.get(translations[0]));
    //construct elements that have the name of the book and verse with all translations for each verse

    setVerseText(resText[0][0].text); // Example: setting to the text of the first verse of the first translation
  });

  return (
    <View>
      <Text>{`Genesis ${chapter}:${verseNumbers.join(",")}`}</Text>
      <Text>{verseText}</Text>
    </View>
  )
};
