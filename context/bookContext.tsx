import { createContext, useContext, useState } from 'react';
import { BookEntry } from '../models/models';

const DictionaryContext = createContext<{
    dictionary: BookDictionary;
    setDictionary: React.Dispatch<React.SetStateAction<BookDictionary>>;
}>({
    dictionary: new Map(),
    setDictionary: () => {},
});

type BookDictionary = Map<string, BookEntry[]>;

export const BookProvider = ({ children }: { children: React.ReactNode }) => {
    const [ dictionary, setDictionary ] = useState<BookDictionary>(new Map());
    
    return (
        <DictionaryContext.Provider value={{ dictionary, setDictionary }}>
            {children}
        </DictionaryContext.Provider>
    );
}

export const useBookDictionary = () => useContext(DictionaryContext);