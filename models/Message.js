class Message {
  constructor(details) {
    this.time = new Date();
    this.userId = details.userId || 0;
    this.type = details.type;
    this.body = details.body;
  }
}

module.exports = Message;
