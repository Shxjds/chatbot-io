const Message = require('../model/message');

async function saveMessage(sender, content) {
  const message = new Message({
    sender,
    content,
    timestamp: new Date(),
  });
  await message.save();
}

module.exports = saveMessage;