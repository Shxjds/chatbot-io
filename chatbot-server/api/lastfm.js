const axios = require('axios');

const API_KEY = process.env.LASTFM_API_KEY;

async function getRandomSong() {
  try {
    const randomPage = Math.floor(Math.random() * 9998) + 1;
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&page=${randomPage}&limit=1&api_key=${API_KEY}&format=json`);

    if (response.data.tracks.track.length === 0) {
      return {
        title: "Une erreur est survenue.",
        link: null,
      };
    }

    const song = response.data.tracks.track[0];
    const spotifyLink = song.url;
    return {
      title: `${song.name} de ${song.artist.name}`,
      link: spotifyLink,
    };
  } catch (error) {
    console.error('Error fetching random song from Last.fm:', error);
    return {
      title: "Une erreur est survenue.",
      link: null,
    };
  }
}

module.exports = getRandomSong;