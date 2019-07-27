const Kafka = require('node-rdkafka');

class KafkaConsumer {
  constructor(Config) {
    this.topics = [];
    this.events = {};

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
      offset_commit_cb: this.onCommit
    };

    this.consumer = new Kafka.KafkaConsumer(conf, {});

    this.start();
  }

  start() {
    this.consumer.connect();

    this.consumer
      .on('ready', () => {
        this.consumer.consume();
        this.consumer.subscribe(this.topics);

        console.log('listening, kafka');
      })
      .on('data', this.onData.bind(this))
      .on('event.error', err => {
        console.log('event error on consumer');
        console.log('err');
        throw err;
      })
      .on('disconnected', err => {
        console.log('disconnected on consumer');
        console.log('err');
        throw err;
      });
  }

  on(topic, callback) {
    if (!this.validateCallback(callback)) {
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
      console.error('There was an error committing', err);

      throw new Error(err);
    } else {
      // Commit went through. Let's log the topic partitions
      console.log('commited', topicPartitions);
    }
  }

  onData(data) {
    const result = data.value.toString();

    const events = this.events[data.topic] || [];

    events.forEach(controller => this.callService(controller, result));
  }

  callService(callback, data) {
    // In this case the service is a function
    if (typeof callback === 'function') {
      callback(data, this.consumer.commit.bind(this.consumer));
      return;
    }

    const splited = callback.split('.');

    const model = splited[0];
    const func = splited[1];

    const Module = use(`App/Controllers/Kafka/${model}`);
    const controller = new Module();

    controller[func](data, this.consumer.commit.bind(this.consumer));
  }

  validateCallback(callback) {
    // In this case the service is a function
    if (typeof callback === 'function') {
      return true;
    }

    const splited = callback.split('.');

    const model = splited[0];
    const func = splited[1];

    const Module = use(`App/Controllers/Kafka/${model}`);
    const controller = new Module();

    return typeof controller[func] === 'function';
  }
}

module.exports = KafkaConsumer;
