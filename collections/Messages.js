const Message = require('../models/Message');

class Messages {
  constructor() {
    this.count = 0;
  }

  create(messagePayload) {
    const message = new Message(messagePayload);
    message.id = ++this.count;
    return message;
  }
}

module.exports = Messages;
