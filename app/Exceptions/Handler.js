/** @type {import('@adonisjs/framework/src/Exception/BaseHandler')} */
const BaseExceptionHandler = use('BaseExceptionHandler');

/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger');

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { response }) {
    switch (error.code) {
      case 'E_VALIDATION_FAILED':
        error.message = error.messages[0].message;
        break;

      case 'E_ROUTE_NOT_FOUND':
        error.message = error.message.replace('E_ROUTE_NOT_FOUND: ', '');
        break;

      default:
        Logger.error(error.code);
    }

    response.status(error.status).send({
      message: error.message,
      code: error.code || 400
    });
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error) {
    if (!(Env.get('ERROR_REPORT', false) === 'true')) {
      return;
    }
    Logger.error(error);
    Logger.error(error.stack);
  }
}

module.exports = ExceptionHandler;
