#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const set = require('lodash/set');
const get = require('lodash/get');

// Initialize schema with default compileroot
const compile = require('./src/compile')();
// Initialize schema with default buildroot
const schema = require('./src/schema')();
const deploy = require('./src/deploy');
// Load up the config
if (!fs.existsSync('.cosmosrc')) {
  console.warn(chalk.yellow('.cosmosrc file does not yet exist.'));
}

let config = {}
try {
  config = JSON.parse(fs.readFileSync('./.cosmosrc', 'utf8'));
} catch (err) {
}

// Execute a deployment, taking an optional contract name
const execDeploy = (contract, options) => {
  // If there is a network, resolve it from the config
  let opts = {}
  let network = options.network || 'development';

  if (!options.network) {
    console.log(chalk.yellow('No network specified. Using defaults.'));
  } else {
    opts = get(config, ['networks', options.network], null)
    if (!opts) {
      console.log(chalk.red(`No network defined in .cosmosrc for \'${options.network}\'!`))
      return;
    };
  }
  
  const deployAndSave = (s) => {
    deploy(s, opts).then(contract => {
      set(s, `networks.${network}.address`, contract.address);
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
  .option('-n, --network <network>', 'Choose a network as defined in .cosmosrc')
  .action(execDeploy);
  //
  // .action(() => {
  //   console.log(program.network)
  // });


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

program.version('0.0.1');
program.parse(process.argv);
