#!/usr/bin/env node
require('dotenv').config()

const fs = require('fs');
const path = require('path');
const program = require('commander');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const set = require('lodash/set');

// Initialize schema with default compileroot
const compile = require('./src/compile')();
const deploy = require('./src/deploy');
// Initialize schema with default buildroot
const schema = require('./src/schema')();

// Execute a deployment, taking an optional contract name
const execDeploy = contract => {

  const deployAndSave = (s) => {
    deploy(s).then(contract => {
      set(s, 'networks.development.address', contract.address);
      schema.save(s);
    });
  }

  if (contract) {
    schema.load(contract).then(deployAndSave);
  } else {
    schema.loadAll().then(schemas => schemas.forEach(deployAndSave));
  }
}

const execCompile = contract => {
  if (contract) {
    compile.compile([contract]).then(compile.format).then(schemas => {
      schemas.forEach(schema.save)
    });
  } else {
    compile.compileAll([contract]).then(compile.format).then(schemas => {
      schemas.forEach(schema.save)
    });
  }
}

// DEPLOY
program
  .command('deploy [contract]')
  .action(execDeploy);

// COMPILE
program
  .command('compile [contract]')
  .description('Compile a contract. Defaults to compile all contracts.')
  .action(execCompile)
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ cosmos compile MetaCoin');
    console.log('    $ cosmos compile');
    console.log();
  });


program
  .version('0.0.1')

  .command('deploy [contract]', 'deploy all contracts')

program.parse(process.argv);
