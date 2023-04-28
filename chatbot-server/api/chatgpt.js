const axios = require('axios');

const API_KEY = process.env.CHATGPT_API_KEY;

async function chatGPT(prompt, model = 'gpt-3.5-turbo') {
  const url = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: model,
    messages: [
      { role: 'user', content: prompt },
    ]
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
  }
}

module.exports = chatGPT;