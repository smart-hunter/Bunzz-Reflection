# Overview

## What Are Reflection Tokens?

Reflection tokens are also known as reward tokens, because they pay token holders a portion of collected fees simply for holding them through a static reward system. Their functionality provides investors with a source of passive income.

A portion of the transaction fees assessed on cryptocurrency transactions can be passed on to investors holding reflection tokens. The process is completed through a reflection mechanism that uses smart contracts to distribute the tokens to all investors in the liquidity pool. While this may seem like a complicated process, it’s simpler than either mining, staking or yield farming. Thus, crypto reflection tokens make it easier for investors of all skill levels to generate passive income from their holdings.

## How Do Reflection Tokens Work?

Cryptocurrency markets are well-known for their volatility, which is often the result of traders trying to achieve gains through buying low and selling high. For example, when whales, or major cryptocurrency investors, buy and sell a large number of crypto coins at one time, values can rise or dip dramatically in a short period of time. 

Reflection tokens provide investors with another way to earn income, encouraging investors to hold rather than trade their tokens. This promotes market stability and allows investors to profit, even if they don’t have the time available to constantly monitor the market.

The reflection mechanism gives token holders a percentage of the transaction tax imposed when a native token is traded. Distribution is equitable to all liquidity pool providers, based on their share of the pool. Smart contracts ensure that the reflection process is fully transparent and executed instantly.

Reflection tokens also benefit each program responsible for its native coin. This benefit stems from raising and maintaining funds that can be used to further develop the program, which can use a portion of its transaction tax to fund growth and stability.


## How to Use?

Similar to ERC20 token.

1. The owner makes the necessary settings and then adds the liquidity to the DEX.
2. Users can transfer the tokens
3. The holders can get the rewards when users transfer the tokens

# Functions

| Function Name                | Action | Description                                     | Permission |
|:-----------------------------|:-------|:------------------------------------------------|------------|
| name                         | read   | return token name                               | any        |
| symbol                       | read   | return token symbol                             | any        |
| decimals                     | read   | return token decimals                           | any        |
| totalSupply                  | read   | return total supply                             | any        |
| balanceOf                    | read   | return token balance for an account             | any        |
| transfer                     | write  | transfer tokens                                 | any        |
| allowance                    | read   | return allowance amount                         | any        |
| approve                      | write  | approve token to spender                        | any        |
| transferFrom                 | write  | transfer token by spender                       | any        |
| increaseAllowance            | write  | increase allowance amount                       | any        |
| decreaseAllowance            | write  | decrease allowance amount                       | any        |
| migrate                      | write  | for old version                                 | any        |
| excludeFromReward            | write  | exclude account from reward                     | onlyOwner  |
| includeInReward              | write  | include account in reward list                  | onlyOwner  |
| excludeFromFee               | write  | exclude account from fee                        | onlyOwner  |
| includeInFee                 | write  | include account in fee list                     | onlyOwner  |
| whitelistAddress             | write  | add account in whitelist                        | onlyOwner  |
| excludeWhitelistedAddress    | write  | exclude account from whitelist                  | onlyOwner  |
| blacklistAddress             | write  | add account in blacklist                        | onlyOwner  |
| unBlacklistAddress           | write  | remove account in blacklist                     | onlyOwner  |
| setEcoSystemFeePercent       | write  | set ecoSystemFeePercent                         | onlyOwner  |
| setLiquidityFeePercent       | write  | set liquidityFeePercent                         | onlyOwner  |
| setTaxFeePercent             | write  | set taxFeePercent                               | onlyOwner  |
| setOwnerFeePercent           | write  | set ownerFeePercent                             | onlyOwner  |
| setBurnFeePercent            | write  | set burnFeePercent                              | onlyOwner  |
| setEcoSystemFeeAddress       | write  | set ecoSystemFeeAddress                         | onlyOwner  |
| setOwnerFeeAddress           | write  | set ownerFeeAddress                             | onlyOwner  |
| addTier                      | write  | add tier                                        | onlyOwner  |
| setMaxTxPercent              | write  | set maxTxPercent                                | onlyOwner  |
| setDefaultSettings           | write  | set settings by default                         | onlyOwner  |
| setSwapAndEvolveEnabled      | write  | set swapAndEvolveEnabled                        | onlyOwner  |
| updateRouterAndPair          | write  | update uniswap router and pair                  | onlyOwner  |
| swapAndEvolve                | write  | swap and evolve                                 | onlyOwner  |
| setMigrationAddress          | write  | set migrate address                             | onlyOwner  |
| updateBurnAddress            | write  | update burn address                             | onlyOwner  |
| setNumberOfTokenToCollectETH | write  | set numberOfTokenToCollectETH                   | onlyOwner  |
| setNumOfETHToSwapAndEvolve   | write  | set numberOfETHToSwapAndEvolve                  | onlyOwner  |
| withdrawToken                | write  | withdraw token by owner                         | onlyOwner  |
| withdrawETH                  | write  | withdraw ETH by owner                           | onlyOwner  |
| isExcludedFromReward         | read   | return excludedFromReward                       | any        |
| reflectionFromTokenInTiers   | read   | return reflection token amount for target tier  | any        |
| reflectionFromToken          | read   | return reflection token amount for default tier | any        |
| tokenFromReflection          | read   | return token amount from reflection             | any        |
| totalFees                    | read   | return totalFees                                | any        |
| accountTier                  | read   | return tier for target account                  | any        |
| feeTier                      | read   | return tier by tierIndex                        | any        |
| feeTiersLength               | read   | return fee tiers length                         | any        |
| isExcludedFromFee            | read   | return isExcludedFromFee                        | any        |
| isWhitelisted                | read   | return isWhitelisted                            | any        |
| isBlacklisted                | read   | return isBlacklisted                            | any        |
| isMigrationStarted           | read   | return isMigrationStarted                       | any        |
| getContractBalance           | read   | return token balance of the contract            | any        |
| getETHBalance                | read   | return ETH balance of the contract              | any        |

### Function I/O parameters

- `name` : read
  * return _name

| name        |  type  | description | I/O |
|:------------|:------:|:------------|:---:|
|             | string | token name  |  O  |

- `symbol` : read
  * return _symbol

| name        |  type  | description  | I/O |
|:------------|:------:|:-------------|:---:|
|             | string | token symbol |  O  |

- `totalSupply` : read
  * return _tTotal

| name    |  type   | description  | I/O |
|:--------|:-------:|:-------------|:---:|
|         | uint256 | total supply |  O  |

- `balanceOf` : read
  <br />
  return balance of target account
  * if account in _isExcluded, _tOwned[account]
  * or _rOwned[account] / currentRate

| name    |  type   | description        | I/O |
|:--------|:-------:|:-------------------|:---:|
| account | address | target address     |  I  |
|         | uint256 | balance of account |  O  |


- `transfer` : write
  <br />
  transfer `amount` of token from `msgSender` to `recipient`

| name      |  type   | description                 | I/O |
|:----------|:-------:|:----------------------------|:---:|
| recipient | address | to address                  |  I  |
| amount    | uint256 | amount of token to transfer |  I  |
|           |  bool   | true by default             |  O  |

- `allowance` : read
  <br />
  return amount of owner allowed to spender

| name    |  type   | description    | I/O |
|:--------|:-------:|:---------------|:---:|
| owner   | address |                |  I  |
| spender | address |                |  I  |
|         | uint256 | allowed amount |  O  |

- `approve` : write
  <br />
  allow spender to access amount of owner's token

| name    |  type   | description      | I/O |
|:--------|:-------:|:-----------------|:---:|
| spender | address |                  |  I  |
| amount  | uint256 |                  |  I  |
|         |  bool   | by default, true |  O  |

- `transferFrom` : write
  <br />
  transfer amount from `sender` to `recipient` by spender

| name      |  type   | description      | I/O |
|:----------|:-------:|:-----------------|:---:|
| sender    | address |                  |  I  |
| recipient | address |                  |  I  |
| amount    | uint256 |                  |  I  |
|           |  bool   | by default, true |  O  |

- `increaseAllowance` : write
  <br />    increase allowance amount of spender

| name       |  type   | description      | I/O |
|:-----------|:-------:|:-----------------|:---:|
| spender    | address |                  |  I  |
| addedValue | uint256 |                  |  I  |
|            |  bool   | by default, true |  O  |

- `decreaseAllowance` : write
  <br /> decrease allowance amount

| name            |  type   | description      | I/O |
|:----------------|:-------:|:-----------------|:---:|
| spender         | address |                  |  I  |
| subtractedValue | uint256 |                  |  I  |
|                 |  bool   | by default, true |  O  |

- `migrate` : write
  <br /> migrate token of target account

| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| account | address |             |  I  |
| amount  | uint256 |             |  I  |

- `excludeFromReward` : write : onlyOwner
  <br /> add target account into `_isExcluded` list

| name    |  type   | description    | I/O |
|:--------|:-------:|:---------------|:---:|
| account | address | target address |  I  |

- `includeInReward` : write : onlyOwner
  <br /> remove target account from `_isExcluded` list

| name    |  type   | description    | I/O |
|:--------|:-------:|:---------------|:---:|
| account | address | target address |  I  |

- `excludeFromFee` : write : onlyOwner
  <br /> add target account into `_isExcludedFromFee` list

| name    |  type   | description    | I/O |
|:--------|:-------:|:---------------|:---:|
| account | address | target address |  I  |

- `includeInFee` : write : onlyOwner
  <br /> remove target account from `_isExcludedFromFee` list

| name    |  type   | description    | I/O |
|:--------|:-------:|:---------------|:---:|
| account | address | target address |  I  |

- `whitelistAddress` : write : onlyOwner
  <br /> mapping _tierIndex to _account

| name       |  type   | description | I/O |
|:-----------|:-------:|:------------|:---:|
| _account   | address |             |  I  |
| _tierIndex | uint256 |             |  I  |

- `excludeWhitelistedAddress` : write : onlyOwner
  <br /> remove target account from whitelist

| name     |  type   | description    | I/O |
|:---------|:-------:|:---------------|:---:|
| _account | address | target address |  I  |

- `blacklistAddress` : write : onlyOwner
  <br /> add target account into blacklist

| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| account | address |             |  I  |

- `unBlacklistAddress` : write : onlyOwner
  <br /> remove target account from blacklist

| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| account | address |             |  I  |


- `setEcoSystemFeePercent` : write : onlyOwner
  <br /> set ecoSystemFee of tier


| name          |  type   | description | I/O |
|:--------------|:-------:|:------------|:---:|
| _tierIndex    | uint256 |             |  I  |
| _ecoSystemFee | uint256 |             |  I  |

- `setLiquidityFeePercent` : write : onlyOwner
  <br /> set liquidityFee of tier

| name          |  type   | description | I/O |
|:--------------|:-------:|:------------|:---:|
| _tierIndex    | uint256 |             |  I  |
| _liquidityFee | uint256 |             |  I  |


- `setTaxFeePercent` : write : onlyOwner
  <br /> set taxFee of tier

| name       |  type   | description | I/O |
|:-----------|:-------:|:------------|:---:|
| _tierIndex | uint256 |             |  I  |
| _taxFee    | uint256 |             |  I  |

- `setOwnerFeePercent` : write : onlyOwner
  <br /> set ownerFee of tier

| name       |  type   | description | I/O |
|:-----------|:-------:|:------------|:---:|
| _tierIndex | uint256 |             |  I  |
| _ownerFee  | uint256 |             |  I  |

- `setBurnFeePercent` : write : onlyOwner
  <br /> set burnFee of tier

| name       |  type   | description | I/O |
|:-----------|:-------:|:------------|:---:|
| _tierIndex | uint256 |             |  I  |
| _burnFee   | uint256 |             |  I  |

- `setEcoSystemFeeAddress` : write : onlyOwner
  <br /> set ecoSystem address of tier

| name        |  type   | description | I/O |
|:------------|:-------:|:------------|:---:|
| _tierIndex  | uint256 |             |  I  |
| _ecoSystem  | address |             |  I  |

- `setOwnerFeeAddress` : write : onlyOwner
  <br /> set owner address of tier

| name       |  type   | description | I/O |
|:-----------|:-------:|:------------|:---:|
| _tierIndex | uint256 |             |  I  |
| _owner     | address |             |  I  |

- `addTier` : write : onlyOwner
  <br /> add tier into `feeTiers` list

| name          |  type   | description | I/O |
|:--------------|:-------:|:------------|:---:|
| _ecoSystemFee | uint256 |             |  I  |
| _liquidityFee | uint256 |             |  I  |
| _taxFee       | uint256 |             |  I  |
| _ownerFee     | uint256 |             |  I  |
| _burnFee      | uint256 |             |  I  |
| _ecoSystem    | address |             |  I  |
| _owner        | address |             |  I  |

- `setMaxTxPercent` : write : onlyOwner
  <br />
```
  _maxTxAmount = _tTotal * maxTxPercent / (10**4);
  ```

- `setDefaultSettings` : write : onlyOwner
  <br />
```
    swapAndLiquifyEnabled = false;
    swapAndEvolveEnabled = true;
 ```

- `setSwapAndEvolveEnabled` : write : onlyOwner
  <br />
  ```
  swapAndEvolveEnabled = _enabled;
  ```

- `updateRouterAndPair` : write : onlyOwner
  <br /> update router and pair

| name             |  type   | description | I/O |
|:-----------------|:-------:|:------------|:---:|
| _uniswapV2Router | address |             |  I  |
| _uniswapV2Pair   | address |             |  I  |

- `swapAndEvolve` : write : onlyOwner

- `setMigrationAddress` : write : onlyOwner
  <br />
```
migration = _migration;
```

- `updateBurnAddress` : write : onlyOwner
  <br /> update burnAddress

| name            | type | description | I/O |
|:----------------|:----:|:------------|:---:|
| _newBurnAddress |      |             |  I  |

- `setNumberOfTokenToCollectETH` : write : onlyOwner
  <br /> set number of token to collect ETH

| name      |  type   | description | I/O |
|:----------|:-------:|:------------|:---:|
| _numToken | uint256 |             |  I  |

- `setNumOfETHToSwapAndEvolve` : write : onlyOwner
  <br />
  ```numOfETHToSwapAndEvolve = _numETH;```

| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| _numETH | uint256 |             |  I  |

- `withdrawToken` : write : onlyOwner
  <br /> withdraw token to owner address

| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| _token  | address |             |  I  |
| _amount | uint256 |             |  I  |

- `withdrawETH` : write : onlyOwner
  <br /> withdraw ETH to owner address

| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| _amount | uint256 |             |  I  |

- `isExcludedFromReward` : read
  * if account in _isExcluded, return true
  * or, return false


| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| account | address |             |  I  |
|         |  bool   |             |  O  |

- `reflectionFromTokenInTiers` : read
  * if deductTransferFee is true, return rTransferAmount
  * or return rAmount

| name              |  type   | description | I/O |
|:------------------|:-------:|:------------|:---:|
| tAmount           | uint256 |             |  I  |
| _tierIndex        | uint256 |             |  I  |
| deductTransferFee |  bool   |             |  I  |
|                   | uint256 |             |  O  |

- `reflectionFromToken` : read
  <br /> return rAmount when tierIndex is 0
  <br />
  ```return reflectionFromTokenInTiers(tAmount, 0, deductTransferFee);```

| name              |  type   | description | I/O |
|:------------------|:-------:|:------------|:---:|
| tAmount           | uint256 |             |  I  |
| deductTransferFee |  bool   |             |  I  |
|                   | uint256 |             |  O  |

- `tokenFromReflection` : read
  <br /> return rAmount / currentRate

| name    |  type   | description | I/O |
|:--------|:-------:|:------------|:---:|
| rAmount | uint256 |             |  I  |
|         | uint256 |             |  O  |

- `totalFees` : read
  <br /> return _tFeeTotal

| name        |  type   | description | I/O |
|:------------|:-------:|:------------|:---:|
|             |         |             |     |
|             | uint256 |             |  O  |

- `accountTier` : read
  <br /> return feeTier of target account

| name     |  type   | description | I/O |
|:---------|:-------:|:------------|:---:|
| _account | address |             |  I  |
|          | FeeTier |             |  O  |

- `feeTier` : read
  <br /> return `feeTiers[_tierIndex]`

| name       |  type   | description | I/O |
|:-----------|:-------:|:------------|:---:|
| _tierIndex | uint256 |             |  I  |
|            |         |             |     |
|            | FeeTier |             |  O  |

- `feeTiersLength` : read
  <br />
```
  return feeTiers.length;
  ```

- `isExcludedFromFee` : read
  <br />
```
  return _isExcludedFromFee[account];
  ```

- `isWhitelisted` : read
  <br /> check if target account is in whitelist
  * if _account in whitelist, return true
  * or return false

| name     |  type   | description    | I/O |
|:---------|:-------:|:---------------|:---:|
| _account | address | target address |  I  |
|          |  bool   |                |  O  |

- `isExcludedFromFee` : read
  <br />
  ```
  return _isBlacklisted[account];
  ```

- `isMigrationStarted` : read
  <br />
  ```
  return migration != address(0);
  ```

- `getContractBalance` : read
  <br />
```
  return balanceOf(address(this));
  ```

- `getETHBalance` : read
  <br />
```
  return address(this).balance;
  ```

## Parameters

##### _router
uniswapV2Router address

##### __name
token name

##### __symbol
token symbol

constructor:
```
    constructor(address _router, string memory __name, string memory __symbol) {
        _name = __name;
        _symbol = __symbol;
        _decimals = 9;

        uint tTotal = 1000000 * 10**6 * 10**9;
        uint rTotal = (MAX - (MAX % tTotal));

        _tTotal = tTotal;
        _rTotal = rTotal;

        // swapAndLiquifyEnabled = true;

        maxTxAmount = 5000 * 10**6 * 10**9;
        // _numTokensSellToAddToLiquidity = 500 * 10**6 * 10**9;

        burnAddress = 0x000000000000000000000000000000000000dEaD;

        address ownerAddress = owner();
        _rOwned[ownerAddress] = rTotal;

        uniswapV2Router = IUniswapV2Router02(_router);
        WETH = uniswapV2Router.WETH();
        // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(address(this), WETH);

        //exclude owner and this contract from fee
        _isExcludedFromFee[ownerAddress] = true;
        _isExcludedFromFee[address(this)] = true;
        //

        // init _feeTiers
        defaultFees = _addTier(0, 500, 500, 0, 0, address(0), address(0));
        _addTier(50, 50, 100, 0, 0, address(0), address(0));
        _addTier(50, 50, 100, 100, 0, address(0), address(0));
        _addTier(100, 125, 125, 150, 0, address(0), address(0));

        emit Transfer(address(0), msg.sender, tTotal);
    }
```

## State Variables
struct type
```
    struct FeeTier {
        uint256 ecoSystemFee;
        uint256 liquidityFee;
        uint256 taxFee;
        uint256 ownerFee;
        uint256 burnFee;
        address ecoSystem;
        address owner;
    }

    struct FeeValues {
        uint256 rAmount;
        uint256 rTransferAmount;
        uint256 rFee;
        uint256 tTransferAmount;
        uint256 tEchoSystem;
        uint256 tLiquidity;
        uint256 tFee;
        uint256 tOwner;
        uint256 tBurn;
    }

    struct tFeeValues {
        uint256 tTransferAmount;
        uint256 tEchoSystem;
        uint256 tLiquidity;
        uint256 tFee;
        uint256 tOwner;
        uint256 tBurn;
    }
```
Storage variables

| name                          |                          type                           | description         |
|:------------------------------|:-------------------------------------------------------:|:--------------------|
| _rOwned                       |           mapping(address => uint256) private           | value by reflection |
| _tOwned                       |           mapping(address => uint256) private           | value in general    |
| _allowances                   | mapping(address => mapping(address => uint256)) private | allowances          |
| _isExcludedFromFee            |            mapping(address => bool) private             |                     |
| _isExcluded                   |            mapping(address => bool) private             |                     |
| _isBlacklisted                |            mapping(address => bool) private             |                     |
| __accountsTier                |           mapping(address => uint256) private           |                     |
| _MAX                          |                uint256 private constant                 |                     |
| _tTotal                       |                     uint256 private                     |                     |
| _rTotal                       |                     uint256 private                     |                     |
| _tFeeTotal                    |                     uint256 private                     |                     |
| _maxFee                       |                     uint256 private                     |                     |
| _name                         |                     string private                      |                     |
| _symbol                       |                     string private                      |                     |
| defaultFees                   |                     FeeTier public                      |                     |
| _previousFees                 |                     FeeTier public                      |                     |
| _emptyFees                    |                     FeeTier public                      |                     |
| _feeTiers                     |                    FeeTier[] private                    |                     |
| uniswapV2Router               |                IUniswapV2Router02 public                |                     |
| uniswapV2Pair                 |                     address public                      |                     |
| WETH                          |                     address public                      |                     |
| migration                     |                     address private                     |                     |
| burnAddress                   |                     address public                      |                     |
| numTokensToCollectETH         |                     uint256 public                      |                     |
| numOfETHToSwapAndEvolve       |                     uint256 public                      |                     |
| maxTxAmount                   |                     uint256 public                      |                     |
| _rTotalExcluded               |                     uint256 private                     |                     |
| _tTotalExcluded               |                     uint256 private                     |                     |
| _decimals                     |                      uint8 private                      |                     |
| inSwapAndLiquify              |                          bool                           |                     |
| _upgraded                     |                      bool private                       |                     |
| swapAndEvolveEnabled          |                       bool public                       |                     |

