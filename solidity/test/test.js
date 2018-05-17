var BlockSigma = artifacts.require("./BlockSigma.sol");

contract('Initialization', function(accounts) {

  it("should return underlying price", function () {
    return BlockSigma.deployed().then(async function(instance) {
      var price = await instance.getUnderlyingPrice();
      console.log("price = ", price.toString());
    });
  });
});
