/** @type {import('@adonisjs/vow/src/Suite')} */
const { test } = use('Test/Suite')('Example unit test');

/** @type {import('@adonisjs/validator/src/Validator')} */
const { validate } = use('Validator');

const TestValidator = use('App/Validators/Test');

test('validate user details', async ({ assert }) => {
  const data = {
    email: 'bad email'
  };

  const validator = new TestValidator();

  const validation = await validate(data, validator.rules);

  assert.isTrue(validation.fails());
  assert.isNotNull(validation.messages());
});
