const { ServiceProvider } = require('@adonisjs/fold');

class KafkaProvider extends ServiceProvider {
  register() {
    this.app.singleton('Kafka', () => {
      const Config = this.app.use('Adonis/Src/Config');
      // eslint-disable-next-line global-require
      return new (require('.'))(Config);
    });
  }
}

module.exports = KafkaProvider;
