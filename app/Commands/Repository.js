const { Command } = require('@adonisjs/ace');
const fs = require('fs');

const Helpers = use('Helpers');

class MakeRepository extends Command {
  static get signature() {
    return 'make:repository { name: Name of the repository }';
  }

  static get description() {
    return 'Make a new repository';
  }

  async handle(args) {
    const { name } = args;

    const repositoryName = this.repositoryName(name);

    const route = Helpers.appRoot(`App/Repositories/${repositoryName}.js`);

    const tempalte = Helpers.resourcesPath('templates/Repository.mustache');
    const file = fs.readFileSync(tempalte, { encoding: 'utf8' });

    await this.generateFile(route, file, { name: repositoryName });

    this.completed('created', route);
  }

  repositoryName(name) {
    const includes = name.toLowerCase().endsWith('repository');

    if (includes) {
      return name;
    }

    return `${this.capitalize(name)}Repository`;
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';

    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

module.exports = MakeRepository;
