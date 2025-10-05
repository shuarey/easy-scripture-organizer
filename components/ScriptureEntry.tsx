import { useEffect, useState } from 'react';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { BookEntry, Verse } from 'models/models';
import { Text, View } from 'react-native';
import { bookDict } from 'services/translationDictionaryService';
import { parallelVerseService } from 'services/parallelVerseService';

type ScriptureEntryProps = {
  translations: string[];
  book: number;
  chapter: number;
  verseNumbers: number[];
};

export const ScriptureEntry = ({ translations, book, chapter, verseNumbers }: ScriptureEntryProps) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [bookNames, setBookNames] = useState<string[]>([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    Promise.all(
      translations.map(async (translation) => {
        await parallelVerseService.getParallelVerses({ translations: [translation], book, chapter, verseNumbers });
        const verseText = await parallelVerseService.getVerseTextByTranslation(translation);
        return {
          translation,
          book,
          chapter,
          text: verseText || "",
        } as Verse; 
      })
    ).then(setVerses);

    bookDict.setBooks(translations).then(() => {
      const names = translations.map((translation) => {
        const bookDetail: BookEntry | undefined = bookDict.getBookFromCache(translation, book);
        return bookDetail?.name || "";
      });
      setBookNames(names);
    });
  }, [translations, book, chapter, verseNumbers]);

  return (
    <View>
      {verses.map((verse, idx) => (
        <View key={idx} style={{ marginBottom: 16 }}>
          <Text>
            {bookNames[idx]} {chapter}:{verseNumbers.join(",")}
          </Text>
          <RenderHtml contentWidth={width} source={{ html: verse.text }} />
        </View>
      ))}
    </View>
  );
};