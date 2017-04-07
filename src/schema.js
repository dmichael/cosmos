const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const mkdirp = require('mkdirp');

const getFileName = (schema) => `${schema['contract_name']}.json`;

const schema = (buildroot = './build/contracts') => {

  /**
   * Loads a contract schema object from contract name
   * @param  {String} contract                   The name of the contract without an extension
   * @param  {String} [root='./build/contracts'] Filepath where schemas are stored
   * @return {Schema}                            The schema object
   */
  const load = (contract) => {
    let name = `${path.basename(contract, '.json')}.json`;
    let filepath = path.join('./', buildroot, name);
    console.log(chalk.gray(`Loading schema for ${contract} at ${filepath}`));

    return new Promise((resolve, reject) => {
      fs.readFile(filepath, 'utf8', (err, contents) => {
        const s = contents.toString();
        resolve(JSON.parse(s));
      });
    });
  }

  const loadAll = () => {
    return new Promise((resolve, reject) => {
      // Get all files in the buildroot and load their contents
      fs.readdir(buildroot, (err, items) => {
        if (err) return reject(err);

        // Get the absolute paths
        promises = items.map(i => load(i))
        Promise.all(promises).then(values => {
          resolve(values);
        });
      });
    });
  }

  /**
   * [save description]
   * @param  {[type]} schema [description]
   * @return {[type]}        [description]
   */
  const save = (schema) => {
    return new Promise((resolve, reject) => {
      mkdirp(buildroot, (err) => {
        if (err) return reject(err);

        const filepath = path.join(buildroot, getFileName(schema));

        console.log(chalk.gray(`Saving schema ${schema['contract_name']} to ${filepath}`));

        if (fs.existsSync(filepath)) {
          console.log(chalk.yellow(`Overwriting existing file ${filepath}`));
        }

        fs.writeFileSync(filepath, JSON.stringify(schema, null, 2));
        resolve(schema);
      });
    });
  }

  return {
    load,
    loadAll,
    save
  }
}

module.exports = schema;
