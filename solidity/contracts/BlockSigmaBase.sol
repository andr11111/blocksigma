pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract BancorConverterStub {
    function getReturn(address _fromToken, address _toToken, uint256 _amount) public view returns (uint256);
}


contract TokenStub {
    function transfer(address dst, uint wad) public returns (bool);
    function transferFrom(address src, address dst, uint wad) public returns (bool);
}


contract BlockSigmaBase is StandardToken {
    address constant BANCOR_TOKEN_ADDRESS = 0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C;
    uint constant EXERCISE_PERIOD = 86400;
    uint constant DECIMALS = 1000000000000000000;

    address public underlyingTokenAddress;
    address public currencyTokenAddress;
    address public issuer;
    uint256 public strike;
    uint256 public exp;    
    address public owner;
    uint256 public minReserve;
    address public underlyingBancorConverter;
    address public currencyBancorConverter;

    uint256 public tokenPrice; // For testing

    struct ExerciseInfo {
        uint256 amount;
        uint256 timestamp;
    }

    uint256 public reserve;    
    mapping(address => ExerciseInfo) public exercises;

    event Issued(address indexed to, uint256 amount);
    event Exercised(address indexed who);
    event Delivered(address indexed who, address indexed to);
    event Liquidated(address indexed who);
    event MintFinished();

    function getRequiredReserveInternal() internal view returns (uint256);
    function excerciseInternal() internal returns (bool);
    function deliverInternal(address to) internal returns (bool);
    function forceLiquidateInternal() internal returns (bool);
  
    modifier onlyIssuer() {
        require(msg.sender == issuer);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }    

    function BlockSigmaBase(address _underlyingTokenAddress, address _currencyTokenAddress,
        uint256 _strike, uint256 _exp, uint256 _minReserve,
        address _underlyingBancorConverter, address _currencyBancorConverter,
        address _issuer) public {

        owner = msg.sender;
        totalSupply_ = 0;
        underlyingTokenAddress = _underlyingTokenAddress;
        currencyTokenAddress = _currencyTokenAddress;
        strike = _strike;
        exp = _exp;
        minReserve = _minReserve;
        underlyingBancorConverter = _underlyingBancorConverter;
        currencyBancorConverter = _currencyBancorConverter;
        issuer = _issuer;
        
        reserve = 0;
        tokenPrice = 13000000000000000000; // TODO: For testing purposes, remove
    }

    function getRequiredReserve() public view returns (uint256) {
        if (isExpired()) {
            return 0;
        }
        return getRequiredReserveInternal();
    }

    /**
    * @dev Ability for writer to issue new contracts    
    */    
    function issue(uint256 amount) public onlyIssuer returns (bool) {        
        uint256 requiredReserve = getRequiredReserve().mul(amount).div(DECIMALS);        
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
        require(isExpired() == false);
        bool result = excerciseInternal();

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
    function deliver(address to) public onlyIssuer returns (bool) {
        bool result = deliverInternal(to);

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

        bool result = forceLiquidateInternal();

        totalSupply_ = totalSupply_.sub(balances[msg.sender]);
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
    * @dev Tells if reserve is below requirement
    */    
    function isReserveLow() public view returns (bool) {
        return reserve < getRequiredReserve().mul(totalSupply_);
    }

    function isExpired() public view returns (bool) {
        return block.timestamp >= exp;
    }    

    function canLiquidate() public view returns (bool) {
        ExerciseInfo storage exerciseInfo = exercises[msg.sender];
        return (balances[msg.sender] > 0 && isReserveLow()) ||
            (exerciseInfo.amount > 0 && exerciseInfo.timestamp < block.timestamp - EXERCISE_PERIOD);
    }

    /**
    * @dev Get price of the underlying token from Bancor
    */    
    function getUnderlyingPrice() public view returns (uint256) {
        return tokenPrice;  // For testing

        /*uint256 size = DECIMALS;
        uint256 currencyToBtn = 221772577993378555;
        uint256 btnToUnderlying = 79252400656351819;
        return DECIMALS.mul(DECIMALS).div(btnToUnderlying); // For testing*/
        
        BancorConverterStub currencyToBtnConverter = BancorConverterStub(currencyBancorConverter);
        uint256 currencyToBtn = currencyToBtnConverter.getReturn(currencyTokenAddress,
            BANCOR_TOKEN_ADDRESS,
            DECIMALS);

        BancorConverterStub btnToUnderlyingConverter = BancorConverterStub(underlyingBancorConverter);
        uint256 btnToUnderlying = btnToUnderlyingConverter.getReturn(BANCOR_TOKEN_ADDRESS,
            underlyingTokenAddress,
            currencyToBtn);

        return DECIMALS.mul(DECIMALS).div(btnToUnderlying);
    }

    // TODO: remove, this is for testing
    function setTokenPrice(uint256 _tokenPrice) onlyOwner public {
        tokenPrice = _tokenPrice;
    }

    function setExpiration(uint256 _exp) onlyOwner public {
        exp = _exp;
    }

    /* Private */
    function transferCurrencyToken(address from, address to, uint256 amount) internal {
        TokenStub currencyToken = TokenStub(currencyTokenAddress);
        if (from == address(this)) {
            currencyToken.transfer(to, amount);
        } else {
            currencyToken.transferFrom(from, to, amount);
        }        
    }

    function transferUnderlyingToken(address from, address to, uint256 amount) internal {
        TokenStub underlyingToken = TokenStub(underlyingTokenAddress);

        if (from == address(this)) {
            underlyingToken.transfer(to, amount);
        } else {
            underlyingToken.transferFrom(from, to, amount);
        }
    }
}
