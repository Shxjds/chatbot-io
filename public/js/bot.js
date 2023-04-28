export class Bot {
  
  constructor(name, avatar, commands) {
    this.name = name;
    this.avatar = avatar;
    this.commands = [
      ...commands,
      createBotCommand('help', () => {
        const descriptions = this.commands.map(cmd => `${cmd.keyword}`).join(', ');
        return `Commandes disponibles:\n${descriptions}`;
      }, 'Affiche toutes les commandes disponibles.'),
      createBotCommand('gpt', async function(message) {
        try {
          const userInput = message.split(' ').slice(1).join(' ');
          const response = await axios.post('/api/chatgpt', { message: userInput });
          return response.data.response;
        } catch (error) {
          console.error('Error fetching ChatGPT response:', error);
          return 'Une erreur est survenue.';
        }
      }, 'Utilise ChatGPT.'),
    ];
  }

  handleMessage(message) {
    const command = this.commands.find(
      cmd => message.toLowerCase().startsWith(cmd.keyword)
    );
    return command ? command.execute(message) : null;
  }
}

function createBotCommand(keyword, execute, description) {
  return {
    keyword,
    execute,
    description,
  };
}

const bot1Commands = [
  createBotCommand('time', () => 'Il est ' + new Date().toLocaleTimeString() + '.', 'Affiche l\'heure actuelle.'),
  createBotCommand('song', async () => {
    try {
      const response = await axios.get('/api/lastfm');
      const { title, link } = response.data.response;
      if (link) {
        return `<a href="${link}" target="_blank">${title}</a>`;
      } else {
        return title;
      }
    } catch (error) {
      console.error('Error fetching random song:', error);
      return 'Une erreur est survenue.';
    }
  }, 'Affiche un son.'),
];

const bot2Commands = [
  createBotCommand('weather', () => 'Il fait beau aujourd\'hui !', 'Affiche la météo.'),
  createBotCommand('joke', async () => {
    try {
      const response = await axios.get('/api/joke');
      return response.data.response;
    } catch (error) {
      console.error('Error fetching random joke:', error);
      return 'Une erreur est survenue.';
    }
  }, 'Affiche une blague.'),
];

const bot3Commands = [
  createBotCommand('quote', () => 'La vie, c\'est comme une bicyclette, il faut avancer pour ne pas perdre l\'équilibre. - Albert Einstein', 'Affiche une citation.'),
  createBotCommand('country', async (message) => {
    const countryName = message.split(' ').slice(1).join(' ');
    if (!countryName) return "Veuillez fournir un nom de pays.";
    try {
      const response = await axios.get(`/api/restcountries/${countryName}`);
      return response.data.response;
    } catch (error) {
      console.error('Error fetching country data:', error);
      return 'Une erreur est survenue.';
    }
  }, 'Affiche des informations sur un pays donné.'),
];

export const botCommands = {
  bot1: bot1Commands,
  bot2: bot2Commands,
  bot3: bot3Commands,
};