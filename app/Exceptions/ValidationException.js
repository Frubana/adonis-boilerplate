const { HttpException } = require('@adonisjs/generic-exceptions');

class ValidationException extends HttpException {
  constructor(messages) {
    super(messages[0].message, 400, 404);
  }
}

module.exports = ValidationException;
