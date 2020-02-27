class UserNotFound extends Error {
  constructor() {
    super('Нет такого пользователя');
    this.status = 404;
    this.expose = true;
  }
}

module.exports = UserNotFound;
