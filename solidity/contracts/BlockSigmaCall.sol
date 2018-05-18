pragma solidity ^0.4.21;

import "./BlockSigmaBase.sol";


contract BlockSigmaCall is BlockSigmaBase {
    
    function BlockSigmaCall(address _underlyingTokenAddress, address _currencyTokenAddress,
        uint256 _strike, uint256 _exp, uint256 _minReserve,
        address _underlyingBancorConverter, address _currencyBancorConverter,
        address _issuer) 
        BlockSigmaBase(_underlyingTokenAddress, _currencyTokenAddress, _strike, _exp, _minReserve, 
        _underlyingBancorConverter, _currencyBancorConverter, _issuer) public {

    }

    function getRequiredReserveInternal() internal view returns (uint256) {
        uint256 liability = 0;
        if (getUnderlyingPrice() > strike) {
            liability = getUnderlyingPrice().sub(strike);
        }     
        return minReserve.add(liability);
    }

    function excerciseInternal() internal returns (bool) {
        // Buyer deposits currency to buy tokens at strike
        uint256 requiredFunds = balances[msg.sender].mul(strike).div(DECIMALS);
        super.transferCurrencyToken(msg.sender, this, requiredFunds);
        return true;
    }
    
    function deliverInternal(address to) internal returns (bool) {        
        // Seller transfers promised tokens to buyer
        super.transferUnderlyingToken(msg.sender, to, exercises[to].amount);        

        // Reserve + payment for tokens is released to seller
        uint256 releasedReserve = reserve.mul(exercises[to].amount).div(totalSupply_);
        super.transferCurrencyToken(this, msg.sender, exercises[to].amount.mul(strike).div(DECIMALS).add(releasedReserve));
        reserve = reserve.sub(releasedReserve);
  
        return true;
    }

    function forceLiquidateInternal() internal returns (bool) {
        ExerciseInfo storage exerciseInfo = exercises[msg.sender];
        uint256 amountToSend;
        uint256 releasedReserve = reserve.mul(balances[msg.sender]).div(totalSupply_);

        if (exerciseInfo.amount > 0) {
            // If buyer deposited funds at exercise, we should release them in addition to reserve
            amountToSend = exerciseInfo.amount.mul(strike).div(DECIMALS).add(releasedReserve);
        } else {
            amountToSend = releasedReserve;
        }

        // Transfer reserve to buyer     
        super.transferCurrencyToken(this, msg.sender, amountToSend);
        reserve = reserve.sub(releasedReserve);

        return true;
    }
}
