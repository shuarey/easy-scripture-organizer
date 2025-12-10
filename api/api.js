import axios from 'axios';

const getBooks = async (translation) => {
  try {
    const response = await axios.get(`https://bolls.life/get-books/${translation}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching book name:', error);
    throw error;
  }
};

const getParallelVerses = async (translations, book, chapter, verses) => {
  try {
    const body = {
      translations: translations,
      book: book,
      chapter: chapter,
      verses: verses,
    };

    const response = await axios.post(`https://bolls.life/get-parallel-verses/`, body);

    const mappedData = response.data.map((translationArray) =>
      translationArray.map(({ verse, ...rest }) => ({
        ...rest,
        verseNumber: verse,
      }))
    );
    return mappedData;
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }
};

export { getParallelVerses, getBooks };
