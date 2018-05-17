pragma solidity ^0.4.17;

import "./BlockSigmaBase.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/math/Math.sol";


contract BlockSigmaCall is BlockSigmaBase {
    
    function getRequiredReserve() public view returns (uint256) {
        uint256 zero = 0;
        uint256 profit = zero.max256(getUnderlyingPrice().sub(strike));
        return minReserve.add(profit);
    }

    function excerciseInternal() internal returns (bool) {
        require(block.timestamp < exp);

        // Buyer deposits currency to buy tokens at strike
        uint256 requiredFunds = balances[msg.sender].mul(strike);
        super.transferCurrencyToken(msg.sender, this, requiredFunds);
        return true;
    }
    
    function deliverInternal(address to) internal returns (bool) {
        // Seller transfers promised tokens to buyer
        super.transferUnderlyingToken(msg.sender, to, exercises[to].amount);

        // Reserve + payment for tokens is released to seller
        uint256 releasedReserve = reserve.div(totalSupply_).mul(exercises[to].amount);
        super.transferCurrencyToken(this, msg.sender, exercises[to].amount.mul(strike).add(releasedReserve));
        reserve = reserve.sub(releasedReserve);
  
        return true;
    }

    function forceLiquidateInternal() internal returns (bool) {
        ExerciseInfo storage exerciseInfo = exercises[msg.sender];
        uint256 amountToSend;
        uint256 releasedReserve = reserve.div(totalSupply_).mul(exerciseInfo.amount);

        if (exerciseInfo.amount > 0) {
            // If buyer deposited funds at exercise, we should release them in addition to reserve
            amountToSend = exerciseInfo.amount.mul(strike).add(releasedReserve);
        } else {
            amountToSend = releasedReserve;
        }

        // Transfer reserve to buyer     
        super.transferCurrencyToken(this, msg.sender, amountToSend);
        reserve = reserve.sub(releasedReserve);
    }
}
