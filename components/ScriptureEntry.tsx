import { memo, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

import { Verse } from 'models/models';

import { parallelVerseService } from 'services/parallelVerseService';
import { useBookDictionary } from 'context/bookContext';

import RenderHtml from './RenderHtml';
import { LoadingScreen } from './LoadingScreen';

type ScriptureEntryProps = {
  translations: string[];
  book: number;
  chapter: number;
  verseNumbers: number[];
  verseNumberRaw: string;
  onLongPress?: () => void;
};

const ScriptureEntry = ({
  translations,
  book,
  chapter,
  verseNumbers,
  verseNumberRaw,
  onLongPress,
}: ScriptureEntryProps) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const { dictionary } = useBookDictionary();
  const [fetching, setFetching] = useState(true);
  const [showDetailContent, setShowDetailContent] = useState(false);

  useEffect(() => {
    let mounted = true;
    setFetching(true);

    (async () => {
      try {
        const results = await Promise.all(
          translations.map(async (translation) => {
            try {
              await parallelVerseService.getParallelVerses({
                translations: [translation],
                book,
                chapter,
                verseNumbers,
              });
              const verseText = await parallelVerseService.getVerseTextByTranslation(translation);
              const bookEntry = dictionary.get(translation)?.find((b) => b.bookid === book);
              return {
                translation,
                book: bookEntry?.name ?? String(book),
                chapter,
                text: verseText || '',
              } as Verse;
            } catch (innerErr) {
              console.error('Failed to fetch translation', translation, innerErr);
              return {
                translation,
                book: String(book),
                chapter,
                text: '',
              } as Verse;
            }
          })
        );

        if (mounted) setVerses(results);
      } catch (err) {
        console.error('Failed to load verses', err);
      } finally {
        if (mounted) setFetching(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  function handleListItemOnPress() {
    setShowDetailContent(!showDetailContent);
  }

  if (fetching) return <LoadingScreen />;

  return (
    <>
      {verses.map((verse, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={handleListItemOnPress}
          onLongPress={onLongPress}
          activeOpacity={0.7}>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title className="text-md flex-auto font-medium">
                {verse.book} {chapter}:{verseNumberRaw} ({verse.translation})
              </ListItem.Title>
              {showDetailContent && <RenderHtml html={verse.text} />}
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default memo(ScriptureEntry);
