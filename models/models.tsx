type verse = {
    "book": number;
    "chapter": number;
    "text": string;
    "translation": string;
    "verse": number;
}

type BookEntry = {
    bookID: number;
    name: string;
    chapters: number;
}

export { verse, BookEntry };