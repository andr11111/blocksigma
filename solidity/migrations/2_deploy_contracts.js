var BlockSigma = artifacts.require("BlockSigma_EOS_June_Put_20000000000000000");
var EOS = artifacts.require("EOS");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(EOS);
  deployer.deploy(BlockSigma);  
};
