const { HttpException } = require('@adonisjs/generic-exceptions');

class TestException extends HttpException {
  constructor() {
    super('This is a test exception', 400, 401);
  }
}

module.exports = TestException;
