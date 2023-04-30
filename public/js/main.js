import { Bot, botCommands } from './bot.js';

// ---------------------------------------------------------------------------
// 1. Data
// ---------------------------------------------------------------------------

const bots = [
  new Bot('DJ Francis', "https://cdn-icons-png.flaticon.com/512/4712/4712139.png", botCommands.bot1),
  new Bot('Petit blagueur', "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/800px-Robot_icon.svg.png", botCommands.bot2),
  new Bot('Géographe', "https://www.pngplay.com/wp-content/uploads/13/Bot-Angry-Icon-PNG-HD-Quality.png", botCommands.bot3),
];

const messages =  document.getElementById("messages");
const inputMessage = document.getElementById("input-message");
const sendButton= document.getElementById("send-button");
const botList = document.getElementById("bot-list");
let lastMessageDate = localStorage.getItem("lastMessageDate") ? new Date(localStorage.getItem("lastMessageDate")) : null;

// ---------------------------------------------------------------------------
// 2. Functions for DOM element creation
// ---------------------------------------------------------------------------

// Function to create a bot list item
function createBotListItem(bot) {
  const listItem = document.createElement("li");
  listItem.style.paddingTop = "20px";
  listItem.style.paddingBottom = "20px";
  listItem.className = "list-group-item bg-transparent border-start-0 border-top-0 border-end-0 bottom-border rounded-0 d-flex align-items-center";

  const avatar = document.createElement("img");
  avatar.className = "rounded-circle mr-2";
  avatar.src = bot.avatar;
  avatar.width = 60;
  avatar.height = 60;
  avatar.style.marginRight = "20px";

  const botName = document.createElement("span");
  botName.style.color = "#f0f0f0";
  botName.style.fontWeight = "bold";
  botName.style.fontSize = "1.1rem";
  botName.textContent = bot.name;

  listItem.append(avatar, botName);
  return listItem;
}

// Function to create a message element
function createMessageElement(messageContent, cssClass, avatarUrl = null, date = new Date()) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(cssClass);

  if (avatarUrl) {
    const avatar = document.createElement("img");
    avatar.src = avatarUrl;
    avatar.classList.add("avatar");
    messageElement.appendChild(avatar);
  }

  const timestamp = date.toLocaleTimeString();
  messageElement.innerHTML += messageContent + ` <span class="timestamp">${timestamp}</span>`;
  return messageElement;
}

// Function to create a date element
function createDateElement(date) {
  const dateElement = document.createElement("div");
  dateElement.classList.add("date-element");

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  const formattedDate = date.toLocaleDateString('fr-FR', options);
  dateElement.textContent = formattedDate.replace(/\b\w/g, (l) => l.toUpperCase());
  return dateElement;
}

// ---------------------------------------------------------------------------
// 3. Utility functions
// ---------------------------------------------------------------------------

// Function to get the message content from the input
function getUserMessage(input) {
  return input.value.trim();
}

// Function to update the last message date
function updateLastMessageDate(today) {
  if (lastMessageDate === null || today.toDateString() !== lastMessageDate.toDateString()) {
    const dateElement = createDateElement(today);
    messages.appendChild(dateElement);
    lastMessageDate = today;
    localStorage.setItem("lastMessageDate", lastMessageDate);
  }
}

// Function to get the bot responses
async function getBotResponses(message) {
  const responses = await Promise.all(bots.map(async bot => await bot.handleMessage(message)));
  return responses.map((response, index) => ({ botIndex: index, response }));
}

// Function to create the bot responses elements
function createReceivedMessageElements(botResponses) {
  return botResponses.map(({ botIndex, response }) => {
    if (response) {
      const bot = bots[botIndex];
      const messageContent = `<strong>${bot.name}:</strong> ${response}`;
      return createMessageElement(messageContent, "received", bot.avatar);
    }
    return null;
  })
  .filter(element => element !== null);
}

// Function to display bot responses recursively
async function displayBotResponses(receivedMessages, index = 0) {
  if (index >= receivedMessages.length) {
    return [];
  }

  const messageElement = receivedMessages[index];

  const timestampElement = messageElement.querySelector(".timestamp");
  const avatarElement = messageElement.querySelector(".avatar");

  timestampElement.remove();
  avatarElement.remove();

  const botMessage = messageElement.innerHTML.trim();
  const botName = botMessage.split(":")[0].replace(/(<([^>]+)>)/gi, "").trim();

  saveMessage(botName, botMessage);
  
  messageElement.appendChild(timestampElement);
  messageElement.prepend(avatarElement);

  const nextMessages = await displayBotResponses(receivedMessages, index + 1);
  return [messageElement, ...nextMessages];
}

// Function to display messages recursively
async function displayMessages(messagesData, index = 0, previousMessageDate = null) {
  if (index >= messagesData.length) {
    return [];
  }

  const { sender, content, timestamp } = messagesData[index];
  const isUser = sender === 'user';
  const cssClass = isUser ? 'sent' : 'received';
  const bot = isUser ? null : bots.find(bot => bot.name === sender);
  const avatarUrl = bot ? bot.avatar : null;
  const messageDate = new Date(timestamp);

  let dateElement = null;
  if (!previousMessageDate || (previousMessageDate && messageDate.toDateString() !== previousMessageDate.toDateString())) {
    dateElement = createDateElement(messageDate);
    previousMessageDate = messageDate;
  }

  const messageElement = createMessageElement(content, cssClass, avatarUrl, messageDate);
  const nextMessages = await displayMessages(messagesData, index + 1, messageDate);

  if (dateElement) {
    return [dateElement, messageElement, ...nextMessages];
  } else {
    return [messageElement, ...nextMessages];
  }
}

// ---------------------------------------------------------------------------
// 4. API functions
// ---------------------------------------------------------------------------

// Function to load the messages from the database
async function loadMessages() {
  try {
    const response = await axios.get('/api/getMessages');
    const messagesData = await response.data;

    const messageElements = await displayMessages(messagesData);
    messages.append(...messageElements);
    messages.scrollTop = messages.scrollHeight;
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
  }
}

// Function to save the message in the database
async function saveMessage(sender, content) {
  try {
    const response = await axios.post('/api/saveMessage', { sender, content });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du message: ', error);
  }
}

// ---------------------------------------------------------------------------
// 5. Main functions
// ---------------------------------------------------------------------------

// Function to send and display the message
async function sendMessage() {
  const message = getUserMessage(inputMessage);
  if (message.length === 0) return;

  updateLastMessageDate(new Date());

  saveMessage("user", `<strong>Moi:</strong> ${message}`);
  messages.appendChild(createMessageElement(`<strong>Moi:</strong> ${message}`, "sent"));
  inputMessage.value = "";

  const writingIndicator = createMessageElement("En train d'écrire...", "received");
  writingIndicator.classList.add("writing-indicator");
  messages.appendChild(writingIndicator);
  messages.scrollTop = messages.scrollHeight;

  const botResponses = await getBotResponses(message);
  const receivedMessages = createReceivedMessageElements(botResponses);

  messages.removeChild(writingIndicator);

  const finalMessages = await displayBotResponses(receivedMessages);
  messages.append(...finalMessages);
  messages.scrollTop = messages.scrollHeight;
}

// ---------------------------------------------------------------------------
// 6. Event listeners and initialization
// ---------------------------------------------------------------------------

inputMessage.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
sendButton.addEventListener("click", sendMessage);

botList.append(...bots.map(createBotListItem));
loadMessages();

/* // Load messages from localStorage
const storedMessages = JSON.parse(localStorage.getItem("chatMessages"));
if (storedMessages) {
  messages.innerHTML = storedMessages;
  messages.scrollTop = messages.scrollHeight;
} */

/* // Save messages in localStorage when the page is unloaded
window.addEventListener("unload", () => {
  localStorage.setItem("chatMessages", JSON.stringify(messages.innerHTML));
}); */