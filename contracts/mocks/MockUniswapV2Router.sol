//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockUniswapV2Router {
    address public WETH;
    constructor (address _WETH) {
        WETH = _WETH;
    }
}