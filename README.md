# Adonis api ready to start

This is a light aplication example api builded with adonis js

To use it you need execute the following commands.

```sh
npm install -g adonis

adonis new {your project name} --blueprint=git@github.com:andresilvagomez/adonis-api-app.git

yarn dev
```

This api has te following modules

- AuthProvider (Auth)
- BodyParserProvider (Body parser)
- CorsProvider (Cors)
- LucidProvider (ORM)
- ValidatorProvider (Validation)
- VowProvider (Test)
- RedisProvider (Cache)

## How to import modules to show docs

```js
/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger');

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {import('@adonisjs/framework/src/Exception/BaseHandler')} */
const BaseExceptionHandler = use('BaseExceptionHandler');

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Post');

/** @type {import('@adonisjs/vow/src/ApiClient')} */
trait('Test/ApiClient');

/** @type {import('@adonisjs/validator/src/Validator')} */
const { validate } = use('Validator');

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
```

## How use Kafka consumer

```js
// start/kafka.js

const Kafka = use('Kafka');

Kafka.on('topic_name', (data, commit) => {
  commit();
});

Kafka.on('topic_name', 'TestController.index');
```

```js
// app/Controllers/Kafka/TestController.js

/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger');

class TestController {
  index(data, commit) {
    Logger.info('kafka data', data);

    commit();
  }
}

module.exports = TestController;
```

```js
// server.js

new Ignitor(fold)
  .appRoot(__dirname)
  // Only add the next line
  .preLoad('start/kafka')
  .fireHttpServer()
  .catch(console.error);
```

```js
// start/app.js
const providers = [
  ...,
  ...,
  `${__dirname}/../providers/Kafka/Provider`
];
```

```js
// config/kafka.js

Update your config file.
```
