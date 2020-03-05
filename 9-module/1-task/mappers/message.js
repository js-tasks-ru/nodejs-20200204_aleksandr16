module.exports = function mapMessage(message) {
  return {
    date: message.date,
    user: message.user,
    text: message.text,
    id: message.id,
  };
};
