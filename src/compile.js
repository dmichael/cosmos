const fs = require('fs');
const path = require('path');
const solc = require('solc');
const chalk = require('chalk');
const moment = require('moment');

const Compile = (contractroot = './contracts') => {
  const format = (compiled) => {
    let formatted = []
    for (let id in compiled.contracts) {
      let name = id.split(':')[1]
      // code and ABI that are needed by web3
      // console.log(name + ' BYTECODE: ' + output.contracts[id].bytecode);
      // console.log(name + ' ABI; ' + JSON.parse(output.contracts[id].interface));
      formatted.push({
        contract_name: name,
        abi: JSON.parse(compiled.contracts[id].interface),
        unlinked_binary: `0x${compiled.contracts[id].bytecode}`,
        updated_at: moment().unix()
      });
    }
    console.log(formatted)
    return formatted;
  }

  const compile = (files = []) => {
    return new Promise((resolve, reject) => {
      const sources = files.reduce((acc, file) => {
        let name = `${path.basename(file, '.sol')}.sol`;
        let filepath = path.join('./', contractroot, name);
        let contract = path.basename(filepath);
        console.log(chalk.bold.cyan(`Reading ${contract}`));
        acc[contract] = fs.readFileSync(filepath, 'utf8').toString();
        return acc
      }, {});

      console.log(chalk.bold.green(`Compiling ${Object.keys(sources).length} contracts`));

      const output = solc.compile({sources: sources}, 1); // 1 activates the optimiser
      resolve(output);
    });
  }

  const compileAll = () => {
    return new Promise((resolve, reject) => {
      // Get all files in the contractroot and load their contents
      fs.readdir(contractroot, (err, files) => {
        compile(files).then(resolve); 
      });
    });
  }

  return {
    format,
    compile,
    compileAll
  }
}



module.exports = Compile;
