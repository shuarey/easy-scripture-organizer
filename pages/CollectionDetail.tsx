import { useEffect } from 'react';
import { ScreenContent } from 'components/ScreenContent';
import { Container } from 'components/Container';
import { Separator } from 'components/Separator';
import { ScriptureEntry } from 'components/ScriptureEntry';

type CollectionDetailProps = {
  route: {
    params: {
      CollectionName: string;
    };
  };
};

export default function CollectionDetail({ route }: CollectionDetailProps) {
  const { CollectionName } = route.params;

  console.log('Collection Name:', CollectionName);

  return (
    <Container>
      <ScreenContent>
        {CollectionName === "Stock Collection" && (
          <>
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={1} chapter={1} verseNumbers={[1, 2]} />
          <Separator />
          <ScriptureEntry translations={["TR", "NKJV"]} book={43} chapter={3} verseNumbers={[16]} />
          <Separator />
          <ScriptureEntry translations={["TR", "NKJV"]} book={45} chapter={4} verseNumbers={[13]} />
          <Separator />
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={19} chapter={127} verseNumbers={[1]} />
          <Separator />
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={20} chapter={3} verseNumbers={[5, 6]} />
          </>
        )}
      </ScreenContent>
    </Container>
  );
}


