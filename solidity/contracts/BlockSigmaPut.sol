pragma solidity ^0.4.21;

import "./BlockSigmaBase.sol";


contract BlockSigmaPut is BlockSigmaBase {
    
    function BlockSigmaPut(address _underlyingTokenAddress, address _currencyTokenAddress,
        uint256 _strike, uint256 _exp, uint256 _minReserve,
        address _underlyingBancorConverter, address _currencyBancorConverter,
        address _issuer) 
        BlockSigmaBase(_underlyingTokenAddress, _currencyTokenAddress, _strike, _exp, _minReserve, 
        _underlyingBancorConverter, _currencyBancorConverter, _issuer) public {

    }

    function getRequiredReserveInternal() internal view returns (uint256) {
        uint256 liability = 0;
        if (getUnderlyingPrice() < strike) {
            liability = strike.sub(getUnderlyingPrice());
        }        
        return minReserve.add(liability);      
    }

    function excerciseInternal() internal returns (bool) {
        require(block.timestamp < exp);

        // Buyer deposits tokens to sell at strike
        super.transferUnderlyingToken(msg.sender, this, balances[msg.sender]);
        return true;
    }
    
    function deliverInternal(address to) internal returns (bool) {
        // Seller transfers payment for sold tokens to buyer
        super.transferCurrencyToken(msg.sender, to, exercises[to].amount.mul(strike).div(DECIMALS));

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
        uint256 releasedReserve = reserve.div(totalSupply_).mul(balances[msg.sender]);

        if (exerciseInfo.amount > 0) {
            // Return deposited tokens to buyer
            super.transferUnderlyingToken(this, msg.sender, exerciseInfo.amount);
        }

        // Transfer reserve to buyer
        super.transferCurrencyToken(this, msg.sender, releasedReserve);
        reserve = reserve.sub(releasedReserve);

        return true;
    }
}
