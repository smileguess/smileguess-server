class Message {
  constructor(messagePayload) {
    this.id = null;
    this.time = new Date();
    this.userId = messagePayload.userId || 0;
    this.type = messagePayload.type;
    this.body = messagePayload.body;
    this.correct = messagePayload.correct;
  }
}

module.exports = Message;
