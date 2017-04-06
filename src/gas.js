


// The maximum amount of gas all transactions in the whole block combined are allowed to consume
// This measurement is important because


const Gas = (web3) => {
  return {
    getLimit: () => web3.eth.getBlock("latest").gasLimit,
    getEstimate: (bytecode) => web3.eth.estimateGas({data: bytecode})
  }
}

module.exports = Gas
