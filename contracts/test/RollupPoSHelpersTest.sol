pragma solidity ^0.5.0;

import "../lib/RollupPoSHelpers.sol";

contract RollupPoSHelpersTest is RollupPoSHelpers{

  constructor() public {}

  function hashOffChainTxTest(bytes memory compressedTxs, uint256 maxTx) public pure returns (uint256) {
    return hashOffChainTx(compressedTxs, maxTx);
  }

  // function testGetHeaderLen(uint bytesLen) public pure returns(uint256) {
  //   return getHeaderLen(bytesLen);
  // }
}