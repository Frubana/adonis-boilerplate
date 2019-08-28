/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait } = use('Test/Suite')('Post');
/** @type {import('http-status-codes')} */
const HttpStatus = use('http-status-codes');

/** @type {import('@adonisjs/vow/src/ApiClient')} */
trait('Test/ApiClient');

test('get list of users with error', async ({ client }) => {
  const data = {
    email: 'andres.silva@frubana.com',
    password: 'frubana123',
    error: true
  };

  const response = await client
    .post('/test')
    .send(data)
    .type('json')
    .end();

  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('get list of users', async ({ client }) => {
  const data = {
    email: 'andres.silva@frubana.com',
    password: 'frubana123',
    error: 'false'
  };

  const response = await client
    .post('/test')
    .send(data)
    .type('json')
    .end();

  response.assertStatus(HttpStatus.OK);
});

test('get list of users', async ({ client }) => {
  const response = await client
    .post('/test')
    .send({})
    .type('json')
    .end();

  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('get bad route', async ({ client }) => {
  const response = await client
    .post('/')
    .send({})
    .type('json')
    .end();

  response.assertStatus(HttpStatus.NOT_FOUND);
});
