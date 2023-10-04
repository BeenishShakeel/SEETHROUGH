import axios from 'axios';

const getAutocompleteResults = async (inputText, apiKey) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: inputText,
          key: apiKey,
          language: 'en',
          types: '(cities)',
        },
      }
    );

    return response.data.predictions;
  } catch (error) {
    console.error('Error fetching autocomplete results:', error);
    return [];
  }
};

export default getAutocompleteResults;