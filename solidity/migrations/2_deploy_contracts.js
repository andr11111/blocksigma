var moment = require('moment');

var BlockSigmaCall = artifacts.require("BlockSigmaCall");
var BlockSigmaPut = artifacts.require("BlockSigmaPut");
var EOS = artifacts.require("EOS");
var DAI = artifacts.require("DAI");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(EOS).then(function() {
    return deployer.deploy(DAI).then(function() {
      var issuer = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
      var strike = 15000000000000000000;                
      var expiration = moment().add(1, 'months').unix(); //1527724800; // May 31 2018; 
      var reserve = 10000000000000000000;
      var bancorConverterAddress = "0x0d8746c7bfac7494904d4133c550c72b02c7cdbb";
      return deployer.deploy(BlockSigmaCall, EOS.address, DAI.address, strike, expiration, reserve, bancorConverterAddress, bancorConverterAddress, issuer)
        .then(function() {
          return deployer.deploy(BlockSigmaPut, EOS.address, DAI.address, strike, expiration, reserve, bancorConverterAddress, bancorConverterAddress, issuer)
        });
    });
  });
};