/** @type {import('@adonisjs/framework/src/Exception/BaseHandler')} */
const BaseExceptionHandler = use('BaseExceptionHandler');

/** @type {import('@adonisjs/framework/src/Logger')} */
const Logger = use('Logger');

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

const Youch = use('youch');

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
  async handle(error, { response, request }) {
    if (Env.get('NODE_ENV') === 'development') {
      const youch = new Youch(error, request.request);
      const html = await youch.toHTML();
      response.status(error.status).send(html);

      return;
    }

    if (error.status >= 500) {
      response.status(500).send({
        message: 'We have an interal issue we report it to the team',
        code: 'INTERNAL'
      });

      return;
    }

    response.status(error.status).send({
      message: error.message,
      code: error.code
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
