import { Bot, botCommands } from './bot.js';

const bots = [
  new Bot('Bot 1', "https://cdn-icons-png.flaticon.com/512/4712/4712139.png", botCommands.bot1),
  new Bot('Bot 2', "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/800px-Robot_icon.svg.png", botCommands.bot2),
  new Bot('Bot 3', "https://www.pngplay.com/wp-content/uploads/13/Bot-Angry-Icon-PNG-HD-Quality.png", botCommands.bot3),
];

const messages =  document.getElementById("messages");
const inputMessage = document.getElementById("input-message");
const sendButton= document.getElementById("send-button");
const botList = document.getElementById("bot-list");

// Fonction pour créer la liste des bots
function createBotListItem(bot) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex align-items-center";

  const avatar = document.createElement("img");
  avatar.className = "rounded-circle mr-2";
  avatar.src = bot.avatar;
  avatar.width = 50;
  avatar.height = 50;

  listItem.appendChild(avatar);
  listItem.appendChild(document.createTextNode(bot.name));
  return listItem;
}

// Fonction pour créer un message
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

// Fonction pour obtenir le contenu du message de l'utilisateur
function getUserMessage(input) {
  return input.value.trim();
}

// Fonction pour obtenir les réponses des bots
async function getBotResponses(message, isWriting) {
  return await Promise.all(bots.map(async bot => await bot.handleMessage(message, isWriting)));
}

// Fonction pour créer des messages à partir des réponses des bots
function createReceivedMessageElements(botResponses) {
  return botResponses
    .map((response, index) => {
      if (response) {
        const messageContent = `<strong>${bots[index].name}:</strong> ${response}`;
        return createMessageElement(messageContent, "received", bots[index].avatar);
      }
      return null;
    })
    .filter(element => element !== null);
}

// Fonction impure pour mettre à jour le DOM
async function sendMessage() {
  const message = getUserMessage(inputMessage);
  if (message.length === 0) return;

  // Afficher le message envoyé
  messages.appendChild(createMessageElement(`You: ${message}`, "sent"));
  inputMessage.value = "";

   // Créer et afficher l'indicateur "en train d'écrire"
  const writingIndicator = createMessageElement("En train d'écrire...", "received");
  writingIndicator.classList.add("writing-indicator");
  messages.appendChild(writingIndicator);
  messages.scrollTop = messages.scrollHeight;

  // Obtenir les réponses des bots et créer les éléments de message
  const botResponses = await getBotResponses(message);
  const receivedMessages = createReceivedMessageElements(botResponses);

  // Supprimer l'indicateur "en train d'écrire"
  messages.removeChild(writingIndicator);

  // Ajouter les messages reçus au DOM et mettre à jour l'interface utilisateur
  messages.append(...receivedMessages);
  messages.scrollTop = messages.scrollHeight;
}

// Charger les messages du localStorage
const storedMessages = JSON.parse(localStorage.getItem("chatMessages"));
if (storedMessages) {
  messages.innerHTML = storedMessages;
  messages.scrollTop = messages.scrollHeight;
}

// Enregistrer les messages dans le localStorage quand la fenêtre est fermée
window.addEventListener("unload", () => {
  localStorage.setItem("chatMessages", JSON.stringify(messages.innerHTML));
});

// Ajouter les bots à la liste
botList.append(...bots.map(createBotListItem));

// Envoyer le message quand l'utilisateur appuie sur Entrée ou en cliquant sur le bouton
inputMessage.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
sendButton.addEventListener("click", sendMessage);