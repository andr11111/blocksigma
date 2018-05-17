pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/math/Math.sol";


contract BancorConverterStub {
    function getReturn(address _fromToken, address _toToken, uint256 _amount) public view returns (uint256);
}


contract TokenStub {
    function transfer(address dst, uint wad) public returns (bool);
    function transferFrom(address src, address dst, uint wad) public returns (bool);
}


contract BlockSigma is StandardToken {
    using Math for uint256;

    modifier onlyIssuer() {
        require(msg.sender == issuer);
        _;
    }

    address constant BANCOR_TOKEN_ADDRESS = 0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C;
    uint constant EXERCISE_PERIOD = 86400;

    address underlyingTokenAddress;
    address currencyTokenAddress;
    address issuer;
    uint256 strike;
    uint256 exp;
    bool isPut;
    address public owner;
    uint256 minReserve;
    address underlyingBancorConverter;
    address currencyBancorConverter;
    address mainIssuer;
    uint256 tokenPrice; // For testing

    struct ExerciseInfo {
        uint256 amount;
        uint256 timestamp;
    }

    uint256 reserve;
    mapping(address => uint256) issues;
    mapping(address => ExerciseInfo) exercises;


    event Issued(address indexed to, uint256 amount);
    event Exercised(address indexed who);
    event Delivered(address indexed who, address indexed to);
    event Liquidated(address indexed who);
    event MintFinished();

    function BlockSigma(address _underlyingTokenAddress, address _currencyTokenAddress,
        uint256 _strike, uint256 _exp, bool _isPut, uint256 _minReserve,
        address _underlyingBancorConverter, address _currencyBancorConverter,
        address _issuer) public {

        owner = msg.sender;
        totalSupply_ = 0;
        underlyingTokenAddress = _underlyingTokenAddress;
        currencyTokenAddress = _currencyTokenAddress;
        strike = _strike;
        exp = _exp;
        isPut = _isPut;
        minReserve = _minReserve;
        underlyingBancorConverter = _underlyingBancorConverter;
        currencyBancorConverter = _currencyBancorConverter;
        issuer = _issuer;
        
        reserve = 0;
        tokenPrice = 20539500000000000; // TODO: For testing purposes, remove
    }

    /**
    * @dev Ability for writer to issue new contracts    
    */    
    function issue(uint256 amount) public onlyIssuer returns (bool) {      
        uint256 requiredReserve = getRequiredReserve().mul(amount);
        depositReserve(requiredReserve);

        totalSupply_ = totalSupply_.add(amount);
        balances[msg.sender] = balances[msg.sender].add(amount);
        emit Issued(msg.sender, amount);
        return true;
    }

    /**
    * @dev Buyer exercises option
    */    
    function exercise() public returns (bool) {
        bool result;
        if (isPut) {
            result = exercisePut();
        } else {
            result = exerciseCall();
        }

        exercises[msg.sender] = ExerciseInfo({
            amount: balances[msg.sender],
            timestamp: block.timestamp
        });
        
        emit Exercised(msg.sender);
        return result;
    }

    /**
    * @dev Writer delivers underlying tokens(call) or currency(put)
    */    
    function deliver(address to) public returns (bool) {
        bool result;
        if (isPut) {
            result = deliverPut(to);
        } else {
            result = deliverCall(to);
        }

        totalSupply_ = totalSupply_.sub(exercises[to].amount);
        delete balances[to];
        delete exercises[to];

        emit Delivered(msg.sender, to);
        return result;
    }

    /**
    * @dev Buyer can force liquidation if exercise is past due or reserve is below requirement
    */    
    function forceLiquidate() public returns (bool) {
        require(canLiquidate());

        bool result;
        if (isPut) {
            result = forceLiquidatePut();
        } else {
            result = forceLiquidateCall();
        }

        delete balances[msg.sender];
        delete exercises[msg.sender];

        emit Liquidated(msg.sender);
        return result;
    }

    /**
    * @dev Writer deposits additional reserve
    */    
    function depositReserve(uint256 amount) public returns (bool) {        
        transferCurrencyToken(msg.sender, this, amount);
        reserve = reserve.add(amount);
        return true;
    }

    /**
    * @dev Writer withdraws reserve
    */    
    function withdrawReserve(uint256 amount) public onlyIssuer returns (bool) {        
        reserve = reserve.sub(amount);
        require(!isReserveLow());
        transferCurrencyToken(this, msg.sender, amount);
        return true;
    }    

    /**
    * @dev Calculates minimum required reserve per contracts
    */    
    function getRequiredReserve() public view returns (uint256) {
        uint256 zero = 0;
        uint256 profit = 0;
        if (isPut) {
            profit = zero.max256(strike.sub(getUnderlyingPrice()));
        } else {
            profit = zero.max256(getUnderlyingPrice().sub(strike));
        }

        return minReserve.add(profit);
    }

    /**
    * @dev Tells if reserve is below requirement
    */    
    function isReserveLow() public view returns (bool) {
        return reserve < getRequiredReserve().mul(totalSupply_);
    }

    function canLiquidate() public view returns (bool) {
        ExerciseInfo storage exerciseInfo = exercises[msg.sender];
        return isReserveLow() ||
            (exerciseInfo.amount > 0 && exerciseInfo.timestamp < block.timestamp - EXERCISE_PERIOD);
    }

    /**
    * @dev Get price of the underlying token from Bancor
    */    
    function getUnderlyingPrice() public view returns (uint256) {
        uint256 size = 1000000;
        BancorConverterStub currencyToBtnConverter = BancorConverterStub(currencyBancorConverter);
        uint256 currencyToBtn = currencyToBtnConverter.getReturn(currencyTokenAddress,
            BANCOR_TOKEN_ADDRESS,
            size);

        BancorConverterStub btnToUnderlyingConverter = BancorConverterStub(underlyingBancorConverter);
        uint256 btnToUnderlying = btnToUnderlyingConverter.getReturn(BANCOR_TOKEN_ADDRESS,
            underlyingTokenAddress,
            currencyToBtn);

        return size.mul(size).div(btnToUnderlying);
        // return tokenPrice; // For testing
    }

    function setTokenPrice(uint256 _tokenPrice) public {
        tokenPrice = _tokenPrice;
    }    

    /* Private */
    function transferCurrencyToken(address from, address to, uint256 amount) private {
        TokenStub currencyToken = TokenStub(currencyTokenAddress);
        currencyToken.transferFrom(from, to, amount);
    }

    function transferUnderlyingToken(address from, address to, uint256 amount) private {
        TokenStub underlyingToken = TokenStub(underlyingTokenAddress);
        underlyingToken.transferFrom(from, to, amount);
    }
    
    function exerciseCall() private returns (bool) {
        require(block.timestamp < exp);

        // Buyer deposits currency to buy tokens at strike
        uint256 requiredFunds = balances[msg.sender].mul(strike);
        transferCurrencyToken(msg.sender, this, requiredFunds);
        return true;
    }

    function exercisePut() private returns (bool) {
        require(block.timestamp < exp);

        // Buyer deposits tokens to sell at strike
        transferUnderlyingToken(msg.sender, this, balances[msg.sender]);
        return true;
    }
    
    function deliverCall(address to) private returns (bool) {
        // Seller transfers promised tokens to buyer
        transferUnderlyingToken(msg.sender, to, exercises[to].amount);

        // Reserve + payment for tokens is released to seller
        uint256 releasedReserve = reserve.div(totalSupply_).mul(exercises[to].amount);
        transferCurrencyToken(this, msg.sender, exercises[to].amount.mul(strike).add(releasedReserve));
        reserve = reserve.sub(releasedReserve);
  
        return true;
    }

    function deliverPut(address to) private returns (bool) {
        // Seller transfers payment for sold tokens to buyer
        transferCurrencyToken(msg.sender, to, exercises[to].amount.mul(strike));

        // Sold tokens are transferred to seller
        transferUnderlyingToken(this, msg.sender, exercises[to].amount);

        // Reserve is released to seller
        uint256 releasedReserve = reserve.div(totalSupply_).mul(exercises[to].amount);
        transferCurrencyToken(this, msg.sender, releasedReserve);
        reserve = reserve.sub(releasedReserve);
        
        return true;
    }    

    function forceLiquidateCall() private returns (bool) {
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
        transferCurrencyToken(this, msg.sender, amountToSend);
        reserve = reserve.sub(releasedReserve);                
    }

    function forceLiquidatePut() private returns (bool) {
        ExerciseInfo storage exerciseInfo = exercises[msg.sender];
        uint256 releasedReserve = reserve.div(totalSupply_).mul(exerciseInfo.amount);

        if (exerciseInfo.amount > 0) {
            // Return deposited tokens to buyer
            transferUnderlyingToken(this, msg.sender, exerciseInfo.amount);
        }

        // Transfer reserve to buyer
        transferCurrencyToken(this, msg.sender, releasedReserve);
        reserve = reserve.sub(releasedReserve);                
    }
}
