const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const chalk = require('chalk');
const moment = require('moment');

const Gas = require('./gas')

const isNetworkAvailable = (uri) => {
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(uri));
    web3.eth.getBlock("latest")
    return true;
  } catch(e) {
    return false;
  }
}

/**
 * [deploy description]
 * @param  {[type]} schema The serialized representation of a contract. In the style of Truffle
 * @return {Promise}          [description]
 */
const deploy = (schema, uri, options = {}) => {
  // create an instance of web3 using the HTTP provider.
  // let uri = options.uri || 'http://localhost:8545';

  console.log(chalk.gray(`Deploying ${schema.contract_name} to ${uri}`));

  const web3 = new Web3(new Web3.providers.HttpProvider(uri));

  const gas = Gas(web3);
  const Contract = web3.eth.contract(schema.abi);

  // let gasEstimate = gas.getEstimate(schema.unlinked_binary);
  // console.log(`gasEstimate is ${gasEstimate}`);
  // console.log("gasLimit: " + gas.getLimit());



  const defaults = {
    from: web3.eth.accounts[0],
    data: schema.unlinked_binary,
    // gasPrice: 100000000000, // 100 Shannon,
    gas: gas.getLimit()
  };
  options = Object.assign(defaults, options);

  return new Promise((resolve, reject) => {

    // using the web3 contract, create it thereby deploying to the network
    Contract.new(options, (err, contract) => {
      if (err) {

        return reject(e);
      }

      if (!contract.address) {
        console.log(`Contract sent: ${contract.transactionHash} ...`);
      } else {
        console.log(`Contract mined! Address: ${contract.address}`);
        resolve(contract);
      }

    });
  });
}

module.exports = {
  isNetworkAvailable,
  deploy
};
