const { Command } = require('@adonisjs/ace');
const fs = require('fs');

const Helpers = use('Helpers');

class MakeService extends Command {
  static get signature() {
    return 'make:service { name: Name of the service }';
  }

  static get description() {
    return 'Make a new service';
  }

  async handle(args) {
    const { name } = args;

    const serviceName = this.serviceName(name);

    const route = Helpers.appRoot(`App/Services/${serviceName}/index.js`);

    const tempalte = Helpers.resourcesPath('templates/service.mustache');
    const file = fs.readFileSync(tempalte, { encoding: 'utf8' });

    await this.generateFile(route, file, { name: serviceName });

    this.completed('created', route);
  }

  serviceName(name) {
    const includes = name.toLowerCase().endsWith('service');

    if (includes) {
      return name;
    }

    return `${this.capitalize(name)}Service`;
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';

    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

module.exports = MakeService;
