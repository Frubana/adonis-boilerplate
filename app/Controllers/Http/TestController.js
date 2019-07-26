/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger');

const TestException = use('App/Exceptions/TestException');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class TestController {
  async index({ request, response }) {
    Logger.info('index in test controller');

    const { error } = request.all();

    if (error === true) {
      throw new TestException();
    }

    const users = await User.all();

    response.json(users);
  }
}

module.exports = TestController;
