# Cosmos

A minimal toolkit for working with Solidity contracts.

**This is a work in progress.**
<br>**I will remove this warning when its ready to use.**

Cosmos aims to provide the bare minimum of command-line tooling needed to compile and deploy contracts to an Ethereum network.

### Features

* **Minimal command line tooling** - Author and deploy contracts without a framework!
* **Truffle compatibility** - Generates and consumes Truffle compatible contract schema and configuration files.
* **Configurable** - Intelligent defaults, configure as necessary.

## Usage

```
npm install -g cosmos
```

```
$ cosmos --help

Usage: cosmos [options] [command]


Commands:

  compile [contract]  Compile a contract. Defaults to compile all contracts.
  deploy [contract]   deploy all contracts
  help [cmd]          display help for [cmd]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

## Compilation

To compile your contracts
```
cosmos compile
```

Before deploying to an Ethereum network, contracts authored in [Solidity](https://solidity.readthedocs.io/en/develop/) must be compiled to produce an [Application Binary Interface (ABI)](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI) and a bytecode representation. The results of the compilation are saved to "schema" that contains references to these artifacts. The schema produced by Cosmos follows that established by [Truffle](https://github.com/trufflesuite/truffle-contract-schema).

Cosmos expects

* Contracts are authored in Solidity
* Contracts reside in `./contracts`
* Compiled schema will be saved to `./build/contracts `

Compilation wraps the [`solc`](https://github.com/ethereum/solc-js) library.

## Deployment

```
cosmos deploy
```

By default, Cosmos will attempt to deploy to `http://localhost:8545`. You must have a node running on at this address for `deploy` to work.

Deployment uses the [`web3.js`](https://github.com/ethereum/web3.js) library.

## Configuration

No configuration file is needed.

## Justification

Cosmos follows the primary conventions of Truffle and the artifacts it generates and consumes are compatible with Truffle.

We are in the "Rails" stage of Ethereum development where do-it-all frameworks like Truffle and Embark are gaining traction. These frameworks work give developers everything needed to get up and running fast with contract development in Solidity.

## Interacting with Deployed Contracts

https://github.com/trufflesuite/truffle-contract
