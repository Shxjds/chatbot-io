const axios = require('axios');

async function getRandomJoke() {
  try {
    const response = await axios.get('https://blague.xyz/api/joke/random');
    return `${response.data.joke.question} ${response.data.joke.answer}`;
  } catch (error) {
    console.error('Error fetching random joke:', error);
    return 'Une erreur est survenue.';
  }
}

module.exports = getRandomJoke;