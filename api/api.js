import axios from 'axios';

const getParallelVerses = async (translations, book, chapter, verses) => {
  try {
    console.log("getParallelVerses called with:", { translations, book, chapter, verses });
    const body = {
        translations: translations,
        book: book,
        chapter: chapter,
        verses: verses
    }

    const response = await axios.post(`https://bolls.life/get-parallel-verses/`, body);

    return response.data;
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }
};

export { getParallelVerses };