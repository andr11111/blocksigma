pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/math/Math.sol";

contract BancorConverter {
    function getReturn(address _fromToken, address _toToken, uint256 _amount) public view returns (uint256);
}

contract BlockSigma is StandardToken {
    using Math for uint256;

    address baseTokenAddress;
    uint256 strike;
    uint256 exp;
    bool isPut;
    address public owner;
    uint256 reserve;
    address bancorConverter;
    address mainIssuer;

    struct ExerciseInfo {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => uint256) reserves;
    mapping(address => uint256) issues;
    mapping(address => ExerciseInfo) exercises;


    event Issued(address indexed to, uint256 amount);
    event Exercised(address indexed who);
    event Liquidated(address indexed who);
    event MintFinished();

    function BlockSigma(address _baseTokenAddress,
        uint256 _strike, uint256 _exp, bool _isPut, uint256 _reserve, address _bancorConverter) public {
        owner = msg.sender;
        totalSupply_ = 0;
        baseTokenAddress = _baseTokenAddress;
        strike = _strike;
        exp = _exp;
        isPut = _isPut;
        reserve = _reserve;
        bancorConverter = _bancorConverter;
    }

    function issue(uint256 amount) public payable returns (bool) {
        require(msg.value >= getRequiredReserve().mul(amount));
        reserves[msg.sender] = msg.value;
        issues[msg.sender] = issues[msg.sender].add(amount); // don't agree
        mainIssuer = msg.sender;

        totalSupply_ = totalSupply_.add(amount);
        balances[msg.sender] = balances[msg.sender].add(amount);
        emit Issued(msg.sender, amount);
        return true;
    }

    function exercise() public payable returns (bool) {
        require(block.timestamp < exp);
        uint256 requiredFunds = balances[msg.sender].mul(strike);
        require(msg.value >= requiredFunds);
        exercises[msg.sender] = ExerciseInfo({
            amount: balances[msg.sender],
            timestamp: block.timestamp
        });
        Exercised(msg.sender);
        return true;
    }

    function deliver(address to) returns (bool) {
        // baseTokenAddress.call(bytes4(sha3("transferFrom(address,address,uint256)")), msg.sender, to, balances[to]);
        delete balances[to];
        msg.sender.transfer(exercises[to].amount.mul(strike).add(reserves[msg.sender]));
        delete exercises[to];
        delete reserves[msg.sender];
        return true;
    }

    function forceLiquidation() returns (bool) {
        address issuer = mainIssuer; // TODO: temporary hack
        require(getRequiredReserve().mul(balances[msg.sender]) > reserves[issuer] ||
            exercises[msg.sender].timestamp < block.timestamp - 86400);

        // Transfer reserve to buyer
        msg.sender.transfer(reserves[issuer]);
        delete balances[msg.sender];
        delete exercises[msg.sender];
        delete reserves[issuer];
        Liquidated(msg.sender);
    }

    function depositReserve(uint256 amount) public payable returns (bool) {
        reserves[msg.sender] = reserves[msg.sender].add(msg.value);
        return true;
    }

    function getRequiredReserve() public view returns (uint256) {
        uint256 zero = 0;
        uint256 profit = 0;
        if (isPut) {
            profit = zero.max256(strike.sub(getTokenPrice()));
        } else {
            profit = zero.max256(getTokenPrice().sub(strike));
        }

        return reserve.add(profit);
    }

    function isReserveLow() public view returns (bool) {
        return reserves[msg.sender] < getRequiredReserve().mul(issues[msg.sender]);
    }

    function getTokenPrice() public view returns (uint256) {
        /*uint256 oneEther = 1000000000000000000;
        BancorConverter ethToBtnConverter = BancorConverter(0xc6725aE749677f21E4d8f85F41cFB6DE49b9Db29);
        uint256 ethToBtn = bancor.getReturn(0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315,
            0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C,
            oneEther);

        BancorConverter btnToEosConverter = BancorConverter(0x0d8746c7bfac7494904d4133c550c72b02c7cdbb);
        uint256 btnToEos = bancor.getReturn(0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C,
            baseTokenAddress,
            ethToBtn);

        return oneEther.mul(oneEther).div(btnToEos);*/
        return 20539500000000000;
    }
    
}
