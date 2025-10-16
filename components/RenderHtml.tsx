import { memo } from 'react';
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

const RenderHtml = ({ html }: { html: string }) => {
  const { width } = useWindowDimensions();
  return <RenderHTML 
    contentWidth={width} 
    source={{ html }}
    tagsStyles={{
        i: { fontStyle: 'italic' }, // Ensure <i> renders as italics
        sup: { fontSize: 12, position: 'relative', top: 5 } // Style for superscript
        }}
    />;
}

export default memo(RenderHtml);