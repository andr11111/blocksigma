
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/math/Math.sol";

contract BlockSigma_EOS_June_Put_20000000000000000 is StandardToken {
    using Math for uint256;

    uint256 totalSupply = 0;
    address baseTokenAddress;
    uint256 strike;
    uint256 exp;
    bool isPut;
    address public owner;
    uint256 reserve;
    address bancorConverter;

    mapping(address => uint256) reserves;
    mapping(address => uint256) issues;
    mapping(address => uint256) exercises;


    event Issued(address indexed to, uint256 amount);
    event Exercised(address indexed who);
    event MintFinished();

    function BlockSigma_EOS_June_Put_20000000000000000(address _baseTokenAddress,
        uint256 _strike, uint256 _exp, bool _isPut, uint256 _reserve, address _bancorConverter) public {
        owner = msg.sender;
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

        totalSupply = totalSupply.add(amount);
        balances[msg.sender] = balances[msg.sender].add(amount);
        emit Issued(msg.sender, amount);
        return true;
    }

    function exercise() public payable returns (bool) {
        require(block.timestamp < exp);
        uint256 requiredFunds = balances[msg.sender].mul(strike);
        require(msg.value >= requiredFunds);
        exercises[msg.sender] = balances[msg.sender];
        Exercised(msg.sender);
    }

    function deliver() {
        
    }

    function depositReserve(uint256 amount) public payable returns (bool) {
        reserves[msg.sender] = reserves[msg.sender].add(msg.value);
        return true;
    }

    function getRequiredReserve() public returns (uint256) {
        uint256 zero = 0;
        uint256 profit = 0;
        if (isPut) {
            profit = zero.max256(strike.sub(getTokenPrice()));
        } else {
            profit = zero.max256(getTokenPrice().sub(strike));
        }

        return reserve.add(profit);
    }

    function getTokenPrice() public returns (uint256) {
        return 20539500000000000;
    }


    /**
         * @dev Function to mint tokens
         * @param _to The address that will receive the minted tokens.
         * @param _amount The amount of tokens to mint.
         * @return A boolean that indicates if the operation was successful.
         *//*

    function mint(address _to, uint256 _amount) onlyOwner canMint public returns (bool) {
        totalSupply_ = totalSupply_.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Mint(_to, _amount);
        emit Transfer(address(0), _to, _amount);
        return true;
    }
*/



}
