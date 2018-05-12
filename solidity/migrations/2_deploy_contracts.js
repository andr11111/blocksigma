var BlockSigma = artifacts.require("BlockSigma");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(BlockSigma);
};
