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
  useEffect(() => {
    console.log('Loading collection details for:', CollectionName);
  }, [CollectionName]);

  return (
    <Container>
      <ScreenContent>
        {CollectionName === "Stock Collection" && (
          <>
          <ScriptureEntry translations={["WLCC", "NKJV"]} book={1} chapter={1} verseNumbers={[1, 2]} />
            {/* <ScriptureEntry verse="John 3:16" text="For God so loved the world..." />
            <Separator />
            <ScriptureEntry verse="Romans 8:28" text="And we know that in all things God works for the good of those who love him..." />
            <Separator />
            <ScriptureEntry verse="Philippians 4:13" text="I can do all this through him who gives me strength." />
            <Separator />
            <ScriptureEntry verse="Psalm 127:1" text="Unless the Lord builds the house, the builders labor in vain." />
            <Separator />
            <ScriptureEntry verse="Proverbs 3:5-6" text="Trust in the Lord with all your heart and lean not on your own understanding..." /> */}
          </>
        )}
      </ScreenContent>
    </Container>
  );
}


