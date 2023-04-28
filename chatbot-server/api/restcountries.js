const axios = require('axios');

async function getCountry(country) {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/translation/${country}`);
    const countryData = response.data[0];
    return `Le pays ${countryData.translations.fra.common} a pour capitale ${countryData.capital[0]} et parle ${Object.values(countryData.languages).join(', ')}.`;
  } catch (error) {
    console.error('Error fetching country data:', error);
    return 'Le pays renseigné n\'existe pas.';
  }
}

module.exports = getCountry;