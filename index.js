#!/usr/bin/env node
require('dotenv').config()

const fs = require('fs');
const path = require('path');
const program = require('commander');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const set = require('lodash/set');

const compile = require('./src/compile');
const deploy = require('./src/deploy');
const schema = require('./src/schema');

const buildPath = './build/contracts';

const getFilePaths = (root) => {
  return new Promise((resolve, reject) => {
    fs.readdir(root, function(err, items) {
      if (err) {
        reject(err);
        return;
      }
      // Get the absolute paths
      items = items.map(i => path.join(root, i))
      resolve(items);
    });
  });
}

// Load the all schemas from the build path
const loadSchemas = (root) => getFilePaths(root).then(filepaths => filepaths.map(schema.load));

program
  .command('deploy [contract]')
  .action((contract) => {
    loadSchemas('./build/contracts')
      .then(schemas => schemas.forEach(s => {
        deploy(s).then(contract => {
          set(s, 'networks.development.address', contract.address);
          schema.save(s);
        });
      }));
    });
  

program
  .command('compile [contract]')
  .description('Compile a contract. Defaults to compile all contracts.')
  .action((contract, options) => {
    getFilePaths('./contracts')
      .then(compile.compile)
      .then(compile.format)
      .then((schemas) => schemas.forEach(s => schema.save(s)))
      .catch(console.error)
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });


program
  .version('0.0.1')

  .command('deploy [contract]', 'deploy all contracts')

program.parse(process.argv);
