const { LogicalException } = require('@adonisjs/generic-exceptions');

class TestException extends LogicalException {
  constructor() {
    super('This is a test exception', 400, 401);
  }
}

module.exports = TestException;
