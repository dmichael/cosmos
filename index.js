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
  .arguments('<command>')
  .option('-f, --force', 'Force recompilation')
  .option('-n, --network', 'Force recompilation')
  .action(function(command) {
    switch(command) {
      case 'deploy':
        loadSchemas('./build/contracts')
          .then(schemas => schemas.forEach(s => {
            deploy(s).then(contract => {
              set(s, 'networks.development.address', contract.address);
              schema.save(s);
            });


          }))
        break;
      case 'compile':
        getFilePaths('./contracts')
          .then(compile.compile)
          .then(compile.format)
          .then((schemas) => schemas.forEach(s => schema.save(s)))
          .catch(console.error)
        break;
      default:
        console.log(`Unknown command: ${command}`)
        break;
    }
  })
  .parse(process.argv);
