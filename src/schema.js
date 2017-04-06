const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const mkdirp = require('mkdirp');


const getFileName = (schema) => `${schema['contract_name']}.json`;

const load = (filepath) => {
  console.log(chalk.gray(`Loading schema at ${filepath}`));
  let schema = fs.readFileSync(filepath, 'utf8').toString();
  return JSON.parse(schema);
}

const save = (schema, buildpath = './../build/contracts') => {
  return new Promise((resolve, reject) => {
    mkdirp(buildpath, (err) => {
      if (err) return reject(err);

      const filepath = path.join(buildpath, getFileName(schema));

      console.log(chalk.gray(`Saving schema ${schema['contract_name']} to ${filepath}`));

      if (fs.existsSync(filepath)) {
        console.log(chalk.yellow(`Overwriting existing file ${filepath}`));
      }

      fs.writeFileSync(filepath, JSON.stringify(schema, null, 2));
      resolve(schema);
    });
  });
}

module.exports = {
  load,
  save
}
