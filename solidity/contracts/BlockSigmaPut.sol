pragma solidity ^0.4.17;

import "./BlockSigmaBase.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/math/Math.sol";


contract BlockSigmaPut is BlockSigmaBase {
    
    function getRequiredReserve() public view returns (uint256) {
        uint256 zero = 0;
        uint256 profit = zero.max256(strike.sub(getUnderlyingPrice()));
        return minReserve.add(profit);      
    }

    function excerciseInternal() internal returns (bool) {
        require(block.timestamp < exp);

        // Buyer deposits tokens to sell at strike
        super.transferUnderlyingToken(msg.sender, this, balances[msg.sender]);
        return true;
    }
    
    function deliverInternal(address to) internal returns (bool) {
        // Seller transfers payment for sold tokens to buyer
        super.transferCurrencyToken(msg.sender, to, exercises[to].amount.mul(strike));

        // Sold tokens are transferred to seller
        super.transferUnderlyingToken(this, msg.sender, exercises[to].amount);

        // Reserve is released to seller
        uint256 releasedReserve = reserve.div(totalSupply_).mul(exercises[to].amount);
        super.transferCurrencyToken(this, msg.sender, releasedReserve);
        reserve = reserve.sub(releasedReserve);
        
        return true;
    }

    function forceLiquidateInternal() internal returns (bool) {
        ExerciseInfo storage exerciseInfo = exercises[msg.sender];
        uint256 releasedReserve = reserve.div(totalSupply_).mul(exerciseInfo.amount);

        if (exerciseInfo.amount > 0) {
            // Return deposited tokens to buyer
            super.transferUnderlyingToken(this, msg.sender, exerciseInfo.amount);
        }

        // Transfer reserve to buyer
        super.transferCurrencyToken(this, msg.sender, releasedReserve);
        reserve = reserve.sub(releasedReserve);
    }
}
