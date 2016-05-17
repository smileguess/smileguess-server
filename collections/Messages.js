const Message = require('../models/Message');

class Messages {
  constructor() {
    this.count = 0;
  }

  create(details) {
    const message = new Message(details);
    message.id = ++this.count;
    return message;
  }
}

module.exports = Messages;
