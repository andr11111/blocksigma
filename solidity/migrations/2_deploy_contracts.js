var BlockSigma = artifacts.require("BlockSigma");
var EOS = artifacts.require("EOS");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(EOS).then(function() {
    var strike = 20000000000000000;
    var expiration = 1527724800; // May 31 2018;
    var isPut = false;
    var reserve = 1000000000000000;
    var bancorConverterAddress = "0x0d8746c7bfac7494904d4133c550c72b02c7cdbb";
    deployer.deploy(BlockSigma, EOS.address, strike, expiration, isPut, reserve, bancorConverterAddress);
  });
};
