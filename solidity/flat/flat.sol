pragma solidity ^0.4.21;

// File: zeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    if (a == 0) {
      return 0;
    }
    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

// File: zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

// File: zeppelin-solidity/contracts/token/ERC20/BasicToken.sol

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
  using SafeMath for uint256;

  mapping(address => uint256) balances;

  uint256 totalSupply_;

  /**
  * @dev total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256) {
    return balances[_owner];
  }

}

// File: zeppelin-solidity/contracts/token/ERC20/ERC20.sol

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: zeppelin-solidity/contracts/token/ERC20/StandardToken.sol

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 * @dev Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is ERC20, BasicToken {

  mapping (address => mapping (address => uint256)) internal allowed;


  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(_value <= allowed[_from][msg.sender]);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   *
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(address _owner, address _spender) public view returns (uint256) {
    return allowed[_owner][_spender];
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   *
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   */
  function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
    allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   *
   * approve should be called when allowed[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
    uint oldValue = allowed[msg.sender][_spender];
    if (_subtractedValue > oldValue) {
      allowed[msg.sender][_spender] = 0;
    } else {
      allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
    }
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

}

// File: contracts/BlockSigmaBase.sol

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
    uint constant PRICE_PRECISION = 1000000000000000000;

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
        // return tokenPrice;  // For testing

        /*uint256 size = PRICE_PRECISION;
        uint256 currencyToBtn = 221772577993378555;
        uint256 btnToUnderlying = 79252400656351819;
        return PRICE_PRECISION.mul(PRICE_PRECISION).div(btnToUnderlying); // For testing*/
        
        BancorConverterStub currencyToBtnConverter = BancorConverterStub(currencyBancorConverter);
        uint256 currencyToBtn = currencyToBtnConverter.getReturn(currencyTokenAddress,
            BANCOR_TOKEN_ADDRESS,
            PRICE_PRECISION);

        BancorConverterStub btnToUnderlyingConverter = BancorConverterStub(underlyingBancorConverter);
        uint256 btnToUnderlying = btnToUnderlyingConverter.getReturn(BANCOR_TOKEN_ADDRESS,
            underlyingTokenAddress,
            currencyToBtn);

        return PRICE_PRECISION.mul(PRICE_PRECISION).div(btnToUnderlying);
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

// File: contracts/BlockSigmaCall.sol

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
        uint256 requiredFunds = balances[msg.sender].mul(strike);
        super.transferCurrencyToken(msg.sender, this, requiredFunds);
        return true;
    }
    
    function deliverInternal(address to) internal returns (bool) {        
        // Seller transfers promised tokens to buyer
        super.transferUnderlyingToken(msg.sender, to, exercises[to].amount);        

        // Reserve + payment for tokens is released to seller
        uint256 releasedReserve = reserve.mul(exercises[to].amount).div(totalSupply_);
        super.transferCurrencyToken(this, msg.sender, exercises[to].amount.mul(strike).add(releasedReserve));
        reserve = reserve.sub(releasedReserve);
  
        return true;
    }

    function forceLiquidateInternal() internal returns (bool) {
        ExerciseInfo storage exerciseInfo = exercises[msg.sender];
        uint256 amountToSend;
        uint256 releasedReserve = reserve.mul(balances[msg.sender]).div(totalSupply_);

        if (exerciseInfo.amount > 0) {
            // If buyer deposited funds at exercise, we should release them in addition to reserve
            amountToSend = exerciseInfo.amount.mul(strike).add(releasedReserve);
        } else {
            amountToSend = releasedReserve;
        }

        // Transfer reserve to buyer     
        super.transferCurrencyToken(this, msg.sender, amountToSend);
        reserve = reserve.sub(releasedReserve);

        return true;
    }
}

// File: contracts/BlockSigmaPut.sol

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

// File: zeppelin-solidity/contracts/math/Math.sol

/**
 * @title Math
 * @dev Assorted math operations
 */
library Math {
  function max64(uint64 a, uint64 b) internal pure returns (uint64) {
    return a >= b ? a : b;
  }

  function min64(uint64 a, uint64 b) internal pure returns (uint64) {
    return a < b ? a : b;
  }

  function max256(uint256 a, uint256 b) internal pure returns (uint256) {
    return a >= b ? a : b;
  }

  function min256(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }
}

// File: contracts/DAI.sol

contract DAI is StandardToken {
  function DAI() public {
    totalSupply_ = 1000000000000000000000;//1000000000000000000000000000;
    balances[msg.sender] = totalSupply_;
  }
}

// File: contracts/EOS.sol

contract EOS is StandardToken {
  function EOS() public {
    totalSupply_ = 1000000000000000000000;//1000000000000000000000000000;
    balances[msg.sender] = totalSupply_;
  }
}

// File: contracts/Migrations.sol

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function Migrations() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
