// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockTON
 * @dev Mock TON token for testing purposes
 */
contract MockTON is ERC20 {
    constructor() ERC20("Mock TON", "MTON") {}
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
