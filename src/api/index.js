const Web3 = require('web3');
const web3 = new Web3();
const contract = require('truffle-contract');

// Import our contract artifacts and turn them into usable abstractions.

const main_artifacts = require('./contracts/BlockSigma');

const MainContract = contract(main_artifacts);

const contractAPI = function (nodeUrl) {
  web3.setProvider(new web3.providers.HttpProvider(nodeUrl));
  MainContract.setProvider(web3.currentProvider);
  if (typeof MainContract.currentProvider.sendAsync !== "function") {
    MainContract.currentProvider.sendAsync = function() {
      return MainContract.currentProvider.send.apply(
        MainContract.currentProvider, arguments
      );
    };
  }


  return MainContract.deployed();
};

export { contractAPI, web3 };

//modules.exports.web3 = web3;
