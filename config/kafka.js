/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

module.exports = {
  groupId: Env.get('KAFKA_GROUP', 'kafka'),

  autoCommit: false,

  url: Env.getOrFail('KAFKA_URL'),

  port: Env.get('KAFKA_PORT', 9092)
};