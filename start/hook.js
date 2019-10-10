const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const { sanitizor } = use('Validator');

  sanitizor.toString = val => {
    return String(val);
  };
});
