/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger');

/** @type {import('node-rdkafka/lib/index')} */
const Kafka = require('node-rdkafka');

class KafkaConsumer {
  constructor(Config) {
    this.topics = [];
    this.events = {};
    this.killContainer = false;
    this.timeout = null;
    this.consumer = null;
    this.producer = null;

    this.Config = Config.get('kafka');

    const { groupId, url, autoCommit, port } = Config.get('kafka');

    if (groupId === null || groupId === undefined || groupId === '') {
      throw new Error('You need define a group');
    }

    if (url === null || url === undefined || url === '') {
      throw new Error('You need define a kafka url');
    }

    const conf = {
      'group.id': groupId,
      'enable.auto.commit': autoCommit,
      'metadata.broker.list': `${url}:${port}`,
      offset_commit_cb: this.onCommit,
      rebalance_cb: this.rebalance
    };

    this.consumer = new Kafka.KafkaConsumer(conf, {});
    this.producer = new Kafka.Producer(conf, {});

    this.start();
  }

  start() {
    this.consumer.connect();
    this.producer.connect();

    this.consumer
      .on('ready', () => {
        this.consumer.consume();
        this.consumer.subscribe(this.topics);

        Logger.info('listening, kafka');
      })
      .on('data', this.onData.bind(this))
      .on('event.error', this.onEventError.bind(this))
      .on('disconnected', err => Logger.info('disconnected on consumer', err));
  }

  on(topic, callback) {
    const callbackFunction = this.validateCallback(callback);

    if (!callbackFunction) {
      return;
    }

    this.topics.push(topic);

    const events = this.events[topic] || [];
    events.push(callback);
    this.events[topic] = events;

    if (this.consumer.isConnected()) {
      this.consumer.subscribe(this.topics);
    }
  }

  onCommit(err, topicPartitions) {
    if (err) {
      // There was an error committing
      Logger.error('There was an error committing', err);
      throw new Error(err);
    }

    // Commit went through. Let's log the topic partitions
    Logger.info('commited', topicPartitions);
  }

  onData(data) {
    const result = data.value.toString();

    const events = this.events[data.topic] || [];

    events.forEach(callback => callback(result, this.consumer.commit.bind(this.consumer)));
  }

  validateCallback(callback) {
    // In this case the service is a function
    if (typeof callback === 'function') {
      return callback;
    }

    const splited = callback.split('.');

    const model = splited[0];
    const func = splited[1];

    const Module = use(`App/Controllers/Kafka/${model}`);
    const controller = new Module();

    if (typeof controller[func] === 'function') {
      return controller[func];
    }

    return null;
  }

  rebalance(err, assign) {
    if (!this.consumer) {
      return;
    }

    if (err.code === Kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS) {
      this.consumer.assign(assign);
      this.killContainer = false;
      clearTimeout(this.timeout);
      Logger.info('assigned partitions');
      return;
    }

    if (err.code === Kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
      // Same as above
      this.consumer.unassign();
      return;
    }

    Logger.error(err);
  }

  onEventError(err) {
    this.killContainer = true;
    this.timeout = setTimeout(() => {
      if (this.killContainer) {
        Logger.error('killing the container...');
        process.exit(1);
      }
    }, 70000);

    Logger.error('event error on consumer', err);
  }

  send(topic, data) {
    if (typeof data !== 'object') {
      throw new Error('You need send a json object in data argument');
    }

    // eslint-disable-next-line new-cap
    const buffer = new Buffer.from(JSON.stringify(data));

    this.producer.produce(topic, null, buffer, null, Date.now(), null);

    Logger.info('sent data to kafka.');
  }
}

module.exports = KafkaConsumer;
