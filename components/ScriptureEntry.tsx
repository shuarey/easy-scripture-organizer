import { memo, useEffect, useState } from 'react';
import { Verse } from 'models/models';
import { Text, View } from 'react-native';
import { parallelVerseService } from 'services/parallelVerseService';
import { useDictionary } from 'context/dictionaryContext';
import RenderHtml from './RenderHtml';
import { LoadingScreen } from './LoadingScreen';

type ScriptureEntryProps = {
  translations: string[];
  book: number;
  chapter: number;
  verseNumbers: number[];
};

const ScriptureEntry = ({ translations, book, chapter, verseNumbers }: ScriptureEntryProps) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [verseSpan, setVerseSpan] = useState<string>("");
  const { dictionary } = useDictionary();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    setVerseSpan(verseNumbers.length > 1 ?
       `${verseNumbers[0]}-${verseNumbers[verseNumbers.length - 1]}` : `${verseNumbers[0]}`);

    Promise.all(
      translations.map(async (translation) => {
        await parallelVerseService.getParallelVerses({ translations: [translation], book, chapter, verseNumbers });
        const verseText = await parallelVerseService.getVerseTextByTranslation(translation);
        const bookEntry = dictionary.get(translation)?.find(b => b.bookid === book);
        return {
          translation,
          book: bookEntry!.name,
          chapter,
          text: verseText || "",
        } as Verse; 
      })
    ).finally(() => setFetching(false)).then(setVerses);
  }, []);

  if (fetching) return <LoadingScreen />;
  
  return (
    <View>
      {verses.map((verse, idx) => (
        <View key={idx} style={{ marginBottom: 16 }}>
          <Text className='text-lg font-medium'>
            {verse.book} {chapter}:{verseSpan} ({verse.translation})
          </Text>
          <RenderHtml html={verse.text} />
        </View>
      ))}
    </View>
  );
};

export default memo(ScriptureEntry);