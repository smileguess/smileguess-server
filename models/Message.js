class Message {
  constructor(details) {
    this.id = null;
    this.time = new Date();
    this.userId = details.payload.userId || 0;
    this.type = details.payload.type;
    this.body = details.payload.body;
  }
}

module.exports = Message;
