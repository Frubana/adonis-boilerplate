const { test } = use('Test/Suite')('User');

/** @type {typeof import('chance')} */
const Chance = use('chance');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

const Faker = new Chance();

test('Create a user', async ({ assert }) => {
  const user = await User.create({
    email: Faker.email(),
    password: Faker.string(),
    username: Faker.twitter()
  });

  const json = user.toJSON();

  assert.isUndefined(json.password);
  assert.isNotNull(json.id);
});

test('Update user', async ({ assert }) => {
  const user = await User.firstOrFail();

  user.username = Faker.twitter();
  user.save();

  const json = user.toJSON();

  assert.isUndefined(json.password);
  assert.isNotNull(json.id);
});

test('Show user with tokens', async ({ assert }) => {
  const user = await User.firstOrFail();

  const tokens = await user.tokens().fetch();

  assert.isEmpty(tokens.rows);
});
