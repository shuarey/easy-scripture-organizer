import { memo, useEffect, useState } from 'react';
import { Verse } from 'models/models';
import { ListItem } from 'react-native-elements'
import { parallelVerseService } from 'services/parallelVerseService';
import { useBookDictionary } from 'context/bookContext';
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
  const {dictionary} = useBookDictionary();
  const [fetching, setFetching] = useState(true);
  const [showDetailContent, setShowDetailContent] = useState(false);

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

  function handleListItemOnPress() {
    setShowDetailContent(!showDetailContent);
  }

  if (fetching) return <LoadingScreen />;
  
  return (
    <>
      {verses.map((verse, idx) => (
        <ListItem key={idx} onPress={handleListItemOnPress}>
          <ListItem.Content>
            <ListItem.Title className='flex-auto font-medium text-md'>
              {verse.book} {chapter}:{verseSpan} ({verse.translation})
            </ListItem.Title>
            {showDetailContent && ( <RenderHtml html={verse.text} />)}
          </ListItem.Content> 
        </ListItem>
      ))}
    </>
  );
};

export default memo(ScriptureEntry);