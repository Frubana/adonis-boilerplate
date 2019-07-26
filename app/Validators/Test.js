class Test {
  get rules() {
    return {
      email: 'required|email',
      password: 'required',
      error: 'required|boolean'
    };
  }

  get sanitizationRules() {
    return {
      email: 'normalize_email',
      error: 'to_boolean'
    };
  }
}

module.exports = Test;
