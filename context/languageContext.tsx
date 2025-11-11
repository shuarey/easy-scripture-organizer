import { createContext, useContext, useState } from 'react';
import { Translation } from '../models/models';

const LanguageContext = createContext<{
    dictionary: LanguageTranslationDict;
    setDictionary: React.Dispatch<React.SetStateAction<LanguageTranslationDict>>;
}>({
    dictionary: new Map(),
    setDictionary: () => {},
});

type LanguageTranslationDict = Map<string, Translation[]>;

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [ dictionary, setDictionary ] = useState<LanguageTranslationDict>(new Map());
    
    return (
        <LanguageContext.Provider value={{ dictionary, setDictionary }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useDictionary = () => useContext(LanguageContext);