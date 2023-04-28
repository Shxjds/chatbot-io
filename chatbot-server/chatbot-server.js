require('dotenv').config();
const express = require('express');
const path = require("path");
const chatGPT = require('./api/chatgpt');
const lastFM = require('./api/lastfm');
const restCountries = require('./api/restcountries');
const joke = require('./api/joke');

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});