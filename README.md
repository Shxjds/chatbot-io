# Chatbot IO

This project is a chat application that allows you to communicate with different bots. Each bot has specific commands and can interact with external APIs to obtain information and respond to user messages.

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the Git repository:

`git clone https://github.com/Shxjds/chatbot-io.git`

2. Navigate to the project directory:

`cd chatbot-io`

3. Install dependencies:

`npm install`

## Configuration

Create a `.env` file at the root of the project to define the API keys and other necessary environment variables. For example:

LASTFM_API_KEY=your_lastfm_api_key
CHATGPT_API_KEY=your_chatgpt_api_key
MONGODB_URI=your_mongodb_uri
PORT=your_port

Replace `your_lastfm_api_key` and `your_chatgpt_api_key` with the Last.fm and Chat GPT API keys you obtained when signing up for the services.
Replace `your_mongodb_uri` with the MongoDB URI you obtained when creating a MongoDB Atlas cluster.
Replace `your_port` with the port you want to use for the server.

## Launching the Project

1. Start the server:

`npm start`

2. Open your browser and go to `http://localhost:3000` to see the chat application in action.

## Bot Commands

Bots have specific commands that you can use to interact with them:

- `/help`: Displays the list of available commands for all bots.
- `/joke`: Displays a random joke.
- `/country` + *country*: Displays information about a given country.
- `/song`: Displays a random song from Last.fm.
- `/gpt` + *prompt*: Allows all bots to respond using the GPT 3.5 API.
- `/quote`: Displays a quote from Albert Einstein.
- `/weather`: Displays the beautiful weather.
- `/time`: Displays the current time.