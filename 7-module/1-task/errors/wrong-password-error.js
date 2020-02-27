class WrongPassword extends Error {
  constructor() {
    super('Неверный пароль');
    this.status = 403;
    this.expose = false;
  }
}

module.exports = WrongPassword;
