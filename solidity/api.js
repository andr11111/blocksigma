var Web3 = require('web3');
var web3 = new Web3();
var contract = require('truffle-contract');

// Import our contract artifacts and turn them into usable abstractions.

var main_artifacts = require('../build/contracts/BlockSigma_EOS_June_Put_20000000000000000');

var MainContract = contract(main_artifacts);

module.exports = async function mainContract(nodeUrl) {
  web3.setProvider(new web3.providers.HttpProvider(nodeUrl));
  MainContract.setProvider(web3.currentProvider);

  return MainContract.deployed();
};

module.exports.web3 = web3;
