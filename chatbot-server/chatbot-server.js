require('dotenv').config();
const express = require('express');
const path = require("path");
const chatGPT = require('./api/chatgpt');
const lastFM = require('./api/lastfm');
const restCountries = require('./api/restcountries');
const joke = require('./api/joke');
const saveMessage = require('./api/saveMessage');
const Message = require('./model/message');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connecté à MongoDB Atlas');
});

mongoose.connection.on('error', (error) => {
  console.error('Erreur lors de la connexion à MongoDB Atlas:', error);
});

const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/chatgpt', async (req, res) => {
  const { message } = req.body;
  const response = await chatGPT(message);
  res.json({ response });
});

app.get('/api/lastfm', async (req, res) => {
  const response = await lastFM();
  res.json({ response });
});

app.get('/api/restcountries/:country', async (req, res) => {
  const response = await restCountries(req.params.country);
  res.json({ response });
});

app.get('/api/joke', async (req, res) => {
  const response = await joke();
  res.json({ response });
});

app.post('/api/saveMessage', async (req, res) => {
  const { sender, content } = req.body;
  try {
    await saveMessage(sender, content);
    res.status(200).send('Message enregistré avec succès');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'enregistrement du message');
  }
});

app.get('/api/getMessages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des messages');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});