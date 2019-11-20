/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TestService {
  async getAll() {
    return Model.all();
  }
}

module.exports = new TestService();
