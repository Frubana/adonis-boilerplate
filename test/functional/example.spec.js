const { test, trait } = use('Test/Suite')('Post');

trait('Test/ApiClient');

test('get list of posts', async ({ client }) => {
  const data = {
    email: 'andres.silva@frubana.com',
    password: 'frubana123',
    error: 'true'
  };

  const response = await client
    .post('/test')
    .send(data)
    .type('json')
    .end();

  response.assertStatus(400);
});

test('get list of posts', async ({ client }) => {
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

  response.assertStatus(200);
});

test('get list of posts', async ({ client }) => {
  const response = await client
    .post('/test')
    .send({})
    .type('json')
    .end();

  response.assertStatus(400);
});
