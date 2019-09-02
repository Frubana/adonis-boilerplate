/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TestRepository {
  async index() {
    return Model.query();
  }
}

module.exports = new TestRepository();
