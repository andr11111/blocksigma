var moment = require('moment');
var BlockSigmaPut = artifacts.require("BlockSigmaPut");
var EOS = artifacts.require("EOS");
var DAI = artifacts.require("DAI");

const writer = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
const buyer = "0x5B9277d45F2531B034AF70CB295e445f7DD90D25";
const size = 10000000000000000000;
const DECIMALS = 1000000000000000000;

contract('BlockSigmaPut', function(accounts) {

  it("should issue new contracts", async function () {
    let put = await BlockSigmaPut.deployed();
    let dai = await DAI.deployed();    

    // Set price
    await put.setTokenPrice(13000000000000000000);

    // Approve transfer
    let reserve = (await put.getRequiredReserve()).mul(size).div(DECIMALS);
    assert.equal(reserve, 120000000000000000000);
    
    await dai.approve(put.address, reserve, {from: writer});
    await put.issue(size, {from: writer});
    let balance = await put.balanceOf(writer);

    assert.equal(balance.toString(), size);

    // Check that it is not expired
    let isExpired = await put.isExpired();
    assert.equal(isExpired, false);    
  });

  it("should allow buyer to buy", async function () {    
    let put = await BlockSigmaPut.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    // Buyer buys 10 options
    await put.transfer(buyer, size, {from: writer});

    let balance = await put.balanceOf(buyer);    
    assert.equal(balance.toString(), size);
  });

  it("should allow buyer to exercise", async function () {    
    let put = await BlockSigmaPut.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    // Give buyer EOS
    await eos.transfer(buyer, size, {from: writer});

    // Buyer approves EOS transfer to contract
    await eos.approve(put.address, size, {from: buyer});

    // Buyer exercises
    await put.exercise({from: buyer});
  });

  it("should allow writer to deliver", async function () {    
    let put = await BlockSigmaPut.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let writerBalanceDAIBefore = await dai.balanceOf(writer);    
    let writerBalanceEOSBefore = await eos.balanceOf(writer);    

    let reserve = await put.reserve();
    let strike = await put.strike();
    let cost = strike.times(size).div(DECIMALS);    
    
    // Writer approves DAI transfer to contract
    await dai.approve(put.address, cost, {from: writer});

    // Writer delivers
    await put.deliver(buyer, {from: writer});

    // Check that buyer has his DAI
    let buyerBalanceDAI = await dai.balanceOf(buyer);
    assert.equal(buyerBalanceDAI.toNumber(), cost.toNumber());

    // Check that buyer has no options anymore
    let buyerBalanceContract = await put.balanceOf(buyer);
    assert.equal(buyerBalanceContract, 0);

    // Check that writer has his EOS
    let writerBalanceEOS = await eos.balanceOf(writer);
    assert.equal(writerBalanceEOS.minus(writerBalanceEOSBefore), size);

    // Check that writer received reserves
    let writerBalanceDAI = await dai.balanceOf(writer);
    assert.equal(writerBalanceDAI.minus(writerBalanceDAIBefore).toString(), reserve.minus(cost).toString());
    assert.equal(writerBalanceDAI.minus(writerBalanceDAIBefore), -30000000000000000000);
  });  

  it("should not allow buyer to liquidate", async function () {    
    let put = await BlockSigmaPut.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let canLiquidate = await put.canLiquidate({from: buyer});
    assert.equal(canLiquidate, false);
  });

  it("should allow to liquidate if reserves is low", async function () {    
    let put = await BlockSigmaPut.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let buyerBalanceDAIBefore = await dai.balanceOf(buyer);

    // issue
    await put.setTokenPrice(13000000000000000000);
    let reserve = (await put.getRequiredReserve()).mul(size).div(DECIMALS);     
    await dai.approve(put.address, reserve, {from: writer});
    await put.issue(size, {from: writer});
    
    // transfer to buyer
    await put.transfer(buyer, size, {from: writer});

    // Check that reserve is low
    await put.setTokenPrice(10000000000000000000);
    let isReserveLow = await put.isReserveLow({from: buyer});
    assert.equal(isReserveLow, true);

    // Check that buyer can liquidate 
    let canLiquidate = await put.canLiquidate({from: buyer});
    assert.equal(canLiquidate, true);

    // liquidate
    put.forceLiquidate({from: buyer});
    
    // Check that buyer received the reserve
    let buyerBalanceDAIAfter = await dai.balanceOf(buyer);
    assert.equal(buyerBalanceDAIAfter.minus(buyerBalanceDAIBefore), 120000000000000000000);                                                               
  });  

  it("should allow to liquidate if reserves is low after exercise", async function () {    
    let put = await BlockSigmaPut.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let buyerBalanceDAIBefore = await dai.balanceOf(buyer);
    let buyerBalanceEOSBefore = await eos.balanceOf(buyer);

    // issue
    await put.setTokenPrice(13000000000000000000);
    let reserve = (await put.getRequiredReserve()).mul(size).div(DECIMALS);    
    await dai.approve(put.address, reserve, {from: writer});
    await put.issue(size, {from: writer});
    
    // transfer to buyer
    await put.transfer(buyer, size, {from: writer});

    // exercise
    let cost = (await put.strike()).mul(size).div(DECIMALS);
    await eos.transfer(buyer, size, {from: writer});
    await eos.approve(put.address, size, {from: buyer});
    await put.exercise({from: buyer});

    // Check that reserve is low
    await put.setTokenPrice(10000000000000000000);
    let isReserveLow = await put.isReserveLow({from: buyer});
    assert.equal(isReserveLow, true);

    // Check that buyer can liquidate 
    let canLiquidate = await put.canLiquidate({from: buyer});
    assert.equal(canLiquidate, true);

    // liquidate
    put.forceLiquidate({from: buyer});
    
    // Check that buyer received the reserve
    let buyerBalanceDAIAfter = await dai.balanceOf(buyer);
    assert.equal(buyerBalanceDAIAfter.minus(buyerBalanceDAIBefore), 120000000000000000000);
    
    // Check that buyer received EOS back
    let buyerBalanceEOSAfter = await eos.balanceOf(buyer);
    assert.equal(buyerBalanceEOSAfter.minus(buyerBalanceEOSBefore), size);
  });

  it("should allow to withdraw entire reserve after expiration", async function () {    
    let put = await BlockSigmaPut.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let writerBalanceDAIBefore = await dai.balanceOf(writer);

    // issue
    await put.setTokenPrice(17000000000000000000);
    let reserve = (await put.getRequiredReserve()).mul(size).div(DECIMALS);    
    await dai.approve(put.address, reserve, {from: writer});
    await put.issue(size, {from: writer});
    
    // transfer to buyer
    await put.transfer(buyer, size, {from: writer});

    // Check that we can't withdraw reserve before expiratio
    put.withdrawReserve(reserve, {from: writer}).then(() => {
      assert(false, "Attempt to withdraw should throw");
    }).catch(async (error) => {
      // set expiration date in the past
      put.setExpiration(moment().subtract(1, 'days').unix());
      let isExpired = await put.isExpired();
      assert.equal(isExpired, true);
      
      // withdraw entire reserve
      await put.withdrawReserve(reserve, {from: writer});
      
      let writerBalanceDAIAfter = await dai.balanceOf(writer);
      assert.equal(writerBalanceDAIAfter.toString(), writerBalanceDAIBefore.toString());      
    });
  });
});
