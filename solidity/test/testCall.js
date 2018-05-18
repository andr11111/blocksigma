var moment = require('moment');
var BlockSigmaCall = artifacts.require("BlockSigmaCall");
var EOS = artifacts.require("EOS");
var DAI = artifacts.require("DAI");

const writer = "0x53DE0dbe22F953F849EF7A79f5ca792129414f59";
const buyer = "0x5B9277d45F2531B034AF70CB295e445f7DD90D25";
const size = 10000000000000000000;
const DECIMALS = 1000000000000000000;

contract('BlockSigmaCall', function(accounts) {

  /*it("should return underlying price", function () {
    return BlockSigmaCall.deployed().then(async function(instance) {
      var price = await instance.getUnderlyingPrice();
      console.log("price = ", price.toString());
    });
  });*/

  it("should issue new contracts", async function () {    
    let call = await BlockSigmaCall.deployed();
    let dai = await DAI.deployed();    

    // Set price
    await call.setTokenPrice(17000000000000000000);

    // Approve transfer
    let reserve = (await call.getRequiredReserve()).mul(size).div(DECIMALS);
    assert.equal(reserve, 120000000000000000000);
    // console.log("reserve:", reserve);
    await dai.approve(call.address, reserve, {from: writer});
    await call.issue(size, {from: writer});
    let balance = await call.balanceOf(writer);
    // console.log("balance:", balance.toString());
    assert.equal(balance.toString(), size);

    // Check that it is not expired
    let isExpired = await call.isExpired();
    assert.equal(isExpired, false);
  });

  it("should allow buyer to buy", async function () {    
    let call = await BlockSigmaCall.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();    

    // Buyer buys 10 options
    await call.transfer(buyer, size, {from: writer});

    let balance = await call.balanceOf(buyer);    
    assert.equal(balance.toString(), size);
  });

  it("should allow buyer to exercise", async function () {    
    let call = await BlockSigmaCall.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();    

    // How much DAI we need to deposit to exercise
    let cost = (await call.strike()).mul(size).div(DECIMALS);    

    // Give buyer DAI
    await dai.transfer(buyer, cost, {from: writer});

    // Buyer approves DAI transfer to contract
    await dai.approve(call.address, cost, {from: buyer});

    // Buyer exercises
    await call.exercise({from: buyer});
  });

  it("should allow writer to deliver", async function () {    
    let call = await BlockSigmaCall.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();    

    let writerBalanceDAI = await dai.balanceOf(writer);

    let reserve = await call.reserve();
    let strike = await call.strike();
    let cost = strike.times(size).div(DECIMALS);
    
    // Writer approves EOS transfer to contract
    await eos.approve(call.address, size, {from: writer});

    // Writer delivers
    await call.deliver(buyer, {from: writer});

    // Check that buyer has his EOS
    let buyerBalanceEOS = await eos.balanceOf(buyer);
    assert.equal(buyerBalanceEOS, size);

    // Check that buyer has no options anymore
    let buyerBalanceContract = await call.balanceOf(buyer);
    assert.equal(buyerBalanceContract, 0);

    // Check that writer received reserves plus payment for delivery
    let writerBalance = await dai.balanceOf(writer);
    assert.equal(writerBalance - writerBalanceDAI, cost.plus(reserve));    
  });  

  it("should not allow buyer to liquidate", async function () {    
    let call = await BlockSigmaCall.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let canLiquidate = await call.canLiquidate({from: buyer});
    assert.equal(canLiquidate, false);
  });

  it("should allow to liquidate if reserves is low", async function () {    
    let call = await BlockSigmaCall.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let buyerBalanceDAIBefore = await dai.balanceOf(buyer);

    // issue
    await call.setTokenPrice(17000000000000000000);
    let reserve = (await call.getRequiredReserve()).mul(size).div(DECIMALS);  
    // console.log("reserve:", reserve);  
    await dai.approve(call.address, reserve, {from: writer});
    await call.issue(size, {from: writer});
    
    // transfer to buyer
    await call.transfer(buyer, size, {from: writer});        

    await call.setTokenPrice(20000000000000000000);
    let isReserveLow = await call.isReserveLow({from: buyer});
    assert.equal(isReserveLow, true);

    let canLiquidate = await call.canLiquidate({from: buyer});
    assert.equal(canLiquidate, true);

    call.forceLiquidate({from: buyer});
    
    let buyerBalanceDAIAfter = await dai.balanceOf(buyer);    

    assert.equal(buyerBalanceDAIAfter.minus(buyerBalanceDAIBefore).toString(), 120000000000000000000);                                                               
  });

  it("should allow to liquidate if reserves is low after exercise", async function () {    
    let call = await BlockSigmaCall.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let buyerBalanceDAIBefore = await dai.balanceOf(buyer);

    // issue
    await call.setTokenPrice(17000000000000000000);
    let reserve = (await call.getRequiredReserve()).mul(size).div(DECIMALS);
    await dai.approve(call.address, reserve, {from: writer});
    await call.issue(size, {from: writer});
    
    // transfer to buyer
    await call.transfer(buyer, size, {from: writer});        

    // exercise
    let strike = await call.strike()
    let cost = strike.times(size).div(DECIMALS);
    await dai.transfer(buyer, cost, {from: writer});
    await dai.approve(call.address, cost, {from: buyer});    
    await call.exercise({from: buyer});

    await call.setTokenPrice(20000000000000000000);
    let isReserveLow = await call.isReserveLow({from: buyer});
    assert.equal(isReserveLow, true);

    let canLiquidate = await call.canLiquidate({from: buyer});
    assert.equal(canLiquidate, true);

    call.forceLiquidate({from: buyer});
    
    let buyerBalanceDAIAfter = await dai.balanceOf(buyer);    

    assert.equal(buyerBalanceDAIAfter.minus(buyerBalanceDAIBefore).toString(), cost.plus(120000000000000000000).toString());
  });

  it("should allow to withdraw entire reserve after expiration", async function () {    
    let call = await BlockSigmaCall.deployed();
    let eos = await EOS.deployed();
    let dai = await DAI.deployed();

    let writerBalanceDAIBefore = await dai.balanceOf(writer);

    // issue
    await call.setTokenPrice(17000000000000000000);
    let reserve = (await call.getRequiredReserve()).mul(size).div(DECIMALS);
    await dai.approve(call.address, reserve, {from: writer});
    await call.issue(size, {from: writer});
    
    // transfer to buyer
    await call.transfer(buyer, size, {from: writer});    

    // Check that we can't withdraw reserve before expiratio
    call.withdrawReserve(reserve, {from: writer}).then(() => {
      assert(false, "Attempt to withdraw should throw");
    }).catch(async (error) => {
      // set expiration date in the past
      call.setExpiration(moment().subtract(1, 'days').unix());
      let isExpired = await call.isExpired();
      assert.equal(isExpired, true);
      
      // withdraw entire reserve
      await call.withdrawReserve(reserve, {from: writer});
      
      let writerBalanceDAIAfter = await dai.balanceOf(writer);
      assert.equal(writerBalanceDAIAfter.toString(), writerBalanceDAIBefore.toString());      
    });
  });
});
