pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/math/Math.sol";

contract DAI is StandardToken {
  function DAI() public {
    totalSupply_ = 1000000000;
  }
}
