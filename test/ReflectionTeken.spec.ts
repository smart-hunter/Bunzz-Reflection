import { BigNumber, BigNumber as BN, constants } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BURN_ADDRESS, ROUTER_ADDRESS } from "./constants/addresses";

const Decimals = BN.from(9);
const OneToken = BN.from(10).pow(Decimals);

const ZERO = constants.Zero;
const ZERO_ADDRESS = constants.AddressZero;

import {
  IUniswapV2Pair,
  IUniswapV2Router02,
  IUniswapV2Factory__factory,
  ReflectionToken,
  ReflectionToken__factory,
  MockUniswapV2Router,
  MockUniswapV2Router__factory,
  MockUniswapPair,
  MockUniswapPair__factory,
  MockERC20,
  MockERC20__factory,
} from "../typechain-types";
import { equal } from "assert";
import { Address } from "cluster";
import { max } from "hardhat/internal/util/bigint";

const TOKEN_NAME = "Test Token";
const TOKEN_SYMBOL = "RETOKEN";

type FeeTier = {
  ecoSystemFee: BigNumber;
  liquidityFee: BigNumber;
  taxFee: BigNumber;
  ownerFee: BigNumber;
  burnFee: BigNumber;
  ecoSystem: string;
  owner: string;
};

type FeeValues = {
  rAmount: BigNumber;
  rTransferAmount: BigNumber;
  rFee: BigNumber;
  tTransferAmount: BigNumber;
  tEchoSystem: BigNumber;
  tLiquidity: BigNumber;
  tFee: BigNumber;
  tOwner: BigNumber;
  tBurn: BigNumber;
};

describe("Test ReflectionToken contract: ", () => {
  const DEFAULT_TIER_INDEX = 0;
  const MAX_FEE = 1000;

  let maxTxAmount = BigNumber;

  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let excludeUser: SignerWithAddress;
  let blockedUser: SignerWithAddress;
  let whitelistedUser: SignerWithAddress;
  let ecoSystem: SignerWithAddress;
  let feeOwner: SignerWithAddress;

  let reflectionToken: ReflectionToken;
  let uniswapV2Pair: IUniswapV2Pair;
  let uniswapV2PairAddress: string;
  let WETHAddress: string;

  let rSupply: BigNumber;
  let tSupply: BigNumber;
  let rate: BigNumber;

  before(async () => {
    [
      owner,
      user1,
      user2,
      user3,
      excludeUser,
      blockedUser,
      whitelistedUser,
      ecoSystem,
      feeOwner,
    ] = await ethers.getSigners();
  });

  const checkFeeTier = async (tier: FeeTier, data: FeeTier) => {
    await expect(tier.ecoSystemFee).equal(data.ecoSystemFee);
    await expect(tier.liquidityFee).equal(data.liquidityFee);
    await expect(tier.taxFee).equal(data.taxFee);
    await expect(tier.ownerFee).equal(data.ownerFee);
    await expect(tier.burnFee).equal(data.burnFee);
    await expect(tier.ecoSystem).equal(data.ecoSystem);
    await expect(tier.owner).equal(data.owner);
  };

  const updateRate = () => {
    rate = rSupply.div(tSupply);
  };

  const updateMaxTxAmount = async () => {
    // @ts-ignore
    maxTxAmount = await reflectionToken.maxTxAmount();
  };

  const sumFee = (feeTier: FeeTier) => {
    return feeTier.ecoSystemFee
      .add(feeTier.liquidityFee)
      .add(feeTier.taxFee)
      .add(feeTier.ownerFee)
      .add(feeTier.burnFee)
      .toNumber();
  };

  describe("1. Deploy contracts", () => {
    it("Deploy main contracts", async () => {
      const reflectionTokenFactory = new ReflectionToken__factory(owner);
      const router = await ethers.getContractAt(
        "IUniswapV2Router02",
        ROUTER_ADDRESS
      );
      // const balanceOfOwner = await ethers.provider.getBalance(owner.address);
      reflectionToken = await reflectionTokenFactory.deploy(
        ROUTER_ADDRESS,
        TOKEN_NAME,
        TOKEN_SYMBOL
      );

      uniswapV2PairAddress = await reflectionToken.uniswapV2Pair();
      uniswapV2Pair = await ethers.getContractAt(
        "IUniswapV2Pair",
        uniswapV2PairAddress
      );
      WETHAddress = await router.WETH();

      await updateMaxTxAmount();
    });
  });

  describe("2. Check initialized values", () => {
    it("Check token name", async () => {
      const tokenName = await reflectionToken.name();
      await expect(tokenName).equal(TOKEN_NAME);
    });

    it("Check token symbol", async () => {
      const tokenSymbol = await reflectionToken.symbol();
      await expect(tokenSymbol).equal(TOKEN_SYMBOL);
    });

    it("Check token decimal", async () => {
      const tokenDecimal = await reflectionToken.decimals();
      await expect(tokenDecimal).equal(9);
    });

    it("Check token totalSupply", async () => {
      const totalSupply = await reflectionToken.totalSupply();
      await expect(totalSupply).equal(OneToken.mul(1000000).mul(1000000));
    });

    it("Check token maxTxAmount", async () => {
      const maxTxAmount = await reflectionToken.maxTxAmount();
      await expect(maxTxAmount).equal(OneToken.mul(5000).mul(1000000));
    });

    it("Check isExcludedFromFee: owner, reflection token ", async () => {
      await expect(
        await reflectionToken.isExcludedFromFee(owner.address)
      ).equal(true);
      await expect(
        await reflectionToken.isExcludedFromFee(reflectionToken.address)
      ).equal(true);
    });

    it("Check FeeTier", async () => {
      await expect(await reflectionToken.feeTiersLength()).equal(4);
      await checkFeeTier(await reflectionToken.feeTier(0), {
        ecoSystemFee: ZERO,
        liquidityFee: BN.from(500),
        taxFee: BN.from(500),
        ownerFee: ZERO,
        burnFee: ZERO,
        ecoSystem: ZERO_ADDRESS,
        owner: ZERO_ADDRESS,
      });

      await checkFeeTier(await reflectionToken.feeTier(1), {
        ecoSystemFee: BN.from(50),
        liquidityFee: BN.from(50),
        taxFee: BN.from(100),
        ownerFee: ZERO,
        burnFee: ZERO,
        ecoSystem: ZERO_ADDRESS,
        owner: ZERO_ADDRESS,
      });

      await checkFeeTier(await reflectionToken.feeTier(2), {
        ecoSystemFee: BN.from(50),
        liquidityFee: BN.from(50),
        taxFee: BN.from(100),
        ownerFee: BN.from(100),
        burnFee: ZERO,
        ecoSystem: ZERO_ADDRESS,
        owner: ZERO_ADDRESS,
      });

      await checkFeeTier(await reflectionToken.feeTier(3), {
        ecoSystemFee: BN.from(100),
        liquidityFee: BN.from(125),
        taxFee: BN.from(125),
        ownerFee: BN.from(150),
        burnFee: ZERO,
        ecoSystem: ZERO_ADDRESS,
        owner: ZERO_ADDRESS,
      });
    });

    it("Check maxFee ", async () => {
      const _maxFee = await reflectionToken.maxFee();
      await expect(_maxFee.toNumber()).equal(MAX_FEE);
    });
  });

  describe("3. Check owner functions", () => {
    describe("- excludeFromReward function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user2).excludeFromReward(user3.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: add user in excludeReward list", async () => {
        // exclude excludeUser from reward
        await reflectionToken.excludeFromReward(excludeUser.address);
        await expect(
          await reflectionToken.isExcludedFromReward(excludeUser.address)
        ).equal(true);
        await expect(
          await reflectionToken.isExcludedFromReward(user1.address)
        ).equal(false);
      });

      it("Revert: Account is already excluded", async () => {
        await expect(
          reflectionToken.excludeFromReward(excludeUser.address)
        ).revertedWith("Account is already excluded");
      });
    });

    describe("- includeInReward function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).includeInReward(excludeUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: remove user from excludeReward list", async () => {
        // exclude excludeUser from reward
        await reflectionToken.includeInReward(excludeUser.address);
        await expect(
          await reflectionToken.isExcludedFromReward(excludeUser.address)
        ).equal(false);
        await expect(
          await reflectionToken.isExcludedFromReward(user1.address)
        ).equal(false);
      });

      it("Revert: Account is already included", async () => {
        await expect(
          reflectionToken.includeInReward(excludeUser.address)
        ).revertedWith("Account is already included");
        await expect(
          reflectionToken.includeInReward(user1.address)
        ).revertedWith("Account is already included");
      });
    });

    describe("- excludeFromFee function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).excludeFromFee(excludeUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: add user from excludeFromFee list", async () => {
        // exclude excludeUser from reward
        await reflectionToken.excludeFromFee(excludeUser.address);
        await expect(
          await reflectionToken.isExcludedFromFee(excludeUser.address)
        ).equal(true);
        await expect(
          await reflectionToken.isExcludedFromFee(user1.address)
        ).equal(false);
      });
    });

    describe("- includeInFee function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).includeInFee(excludeUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: remove user from includeInFee list", async () => {
        // exclude excludeUser from reward
        await reflectionToken.includeInFee(excludeUser.address);
        await expect(
          await reflectionToken.isExcludedFromFee(excludeUser.address)
        ).equal(false);
        await expect(
          await reflectionToken.isExcludedFromFee(user1.address)
        ).equal(false);
      });
    });

    describe("- whitelistAddress function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken
            .connect(user1)
            .whitelistAddress(excludeUser.address, 0)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        await expect(
          reflectionToken.whitelistAddress(excludeUser.address, 6)
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: ReflectionToken: Selected account is in blacklist", async () => {
        // block user
        await reflectionToken.blacklistAddress(blockedUser.address);
        await expect(
          reflectionToken.whitelistAddress(blockedUser.address, 0)
        ).revertedWith("ReflectionToken: Selected account is in blacklist");
      });

      it("Revert: ReflectionToken: Invalid address", async () => {
        await expect(
          reflectionToken.whitelistAddress(ZERO_ADDRESS, 0)
        ).revertedWith("ReflectionToken: Invalid address");
      });

      it("Action: add user in whitelist", async () => {
        // exclude excludeUser from reward
        await reflectionToken.whitelistAddress(whitelistedUser.address, 1);
        await expect(
          await reflectionToken.isWhitelisted(whitelistedUser.address)
        ).equal(true);
        await expect(await reflectionToken.isWhitelisted(user1.address)).equal(
          false
        );
      });
    });

    describe("- excludeWhitelistedAddress function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken
            .connect(user1)
            .excludeWhitelistedAddress(whitelistedUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: ReflectionToken: Invalid address", async () => {
        await expect(
          reflectionToken.excludeWhitelistedAddress(ZERO_ADDRESS)
        ).revertedWith("ReflectionToken: Invalid address");
      });

      it("Revert: ReflectionToken: Account is not in whitelist", async () => {
        await expect(
          reflectionToken.excludeWhitelistedAddress(user1.address)
        ).revertedWith("ReflectionToken: Account is not in whitelist");
      });

      it("Action: remove user from whitelist", async () => {
        // exclude excludeUser from reward
        await reflectionToken.excludeWhitelistedAddress(
          whitelistedUser.address
        );
        await expect(
          await reflectionToken.isWhitelisted(whitelistedUser.address)
        ).equal(false);
        await expect(await reflectionToken.isWhitelisted(user1.address)).equal(
          false
        );
      });
    });

    describe("- blacklistAddress function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).blacklistAddress(blockedUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: add user in blacklist", async () => {
        // exclude excludeUser from reward
        await reflectionToken.blacklistAddress(blockedUser.address);
        await expect(
          await reflectionToken.isBlacklisted(blockedUser.address)
        ).equal(true);
        await expect(await reflectionToken.isBlacklisted(user1.address)).equal(
          false
        );
      });
    });

    describe("- unBlacklistAddress function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).unBlacklistAddress(blockedUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: add user in blacklist", async () => {
        // exclude excludeUser from reward
        await reflectionToken.unBlacklistAddress(blockedUser.address);
        await expect(
          await reflectionToken.isBlacklisted(blockedUser.address)
        ).equal(false);
        await expect(await reflectionToken.isBlacklisted(user1.address)).equal(
          false
        );
      });
    });

    describe("- setEcoSystemFeePercent function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setEcoSystemFeePercent(1, 1000)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        const feeTierLength = await reflectionToken.feeTiersLength();
        await expect(
          reflectionToken.setEcoSystemFeePercent(feeTierLength, 1000)
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: checkFeesChanged - ReflectionToken: Fees exceeded max limitation", async () => {
        const feeTier = await reflectionToken.feeTier(1);
        const ecoSystemFee =
          MAX_FEE - sumFee(feeTier) + feeTier.ecoSystemFee.toNumber();
        await expect(
          reflectionToken.setEcoSystemFeePercent(1, ecoSystemFee + 1)
        ).revertedWith("ReflectionToken: Fees exceeded max limitation");
      });

      it("Action: update ecoSystemFeePercent", async () => {
        // test feeTier 1
        const feeTier = await reflectionToken.feeTier(1);
        const ecoSystemFee =
          MAX_FEE - sumFee(feeTier) + feeTier.ecoSystemFee.toNumber();
        await reflectionToken.setEcoSystemFeePercent(1, ecoSystemFee - 1);
        const newFeeTier = await reflectionToken.feeTier(1);
        await expect(newFeeTier.ecoSystemFee).equal(ecoSystemFee - 1);
        // reset ecoSystemFeePercent
        await reflectionToken.setEcoSystemFeePercent(1, feeTier.ecoSystemFee);
      });
    });

    describe("- setLiquidityFeePercent function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setLiquidityFeePercent(1, 1000)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        const feeTierLength = await reflectionToken.feeTiersLength();
        await expect(
          reflectionToken.setLiquidityFeePercent(feeTierLength, 1000)
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: checkFeesChanged - ReflectionToken: Fees exceeded max limitation", async () => {
        const feeTier = await reflectionToken.feeTier(1);
        const liquidityFee =
          MAX_FEE - sumFee(feeTier) + feeTier.liquidityFee.toNumber();
        await expect(
          reflectionToken.setLiquidityFeePercent(1, liquidityFee + 1)
        ).revertedWith("ReflectionToken: Fees exceeded max limitation");
      });

      it("Action: update liquidityFeePercent", async () => {
        // test feeTier 1
        const feeTier = await reflectionToken.feeTier(1);
        const liquidityFee =
          MAX_FEE - sumFee(feeTier) + feeTier.liquidityFee.toNumber();
        await reflectionToken.setLiquidityFeePercent(1, liquidityFee - 1);
        const newFeeTier = await reflectionToken.feeTier(1);
        await expect(newFeeTier.liquidityFee).equal(liquidityFee - 1);
        // reset ecoSystemFeePercent
        await reflectionToken.setLiquidityFeePercent(1, feeTier.liquidityFee);
      });
    });

    describe("- setTaxFeePercent function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setTaxFeePercent(1, 1000)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        const feeTierLength = await reflectionToken.feeTiersLength();
        await expect(
          reflectionToken.setTaxFeePercent(feeTierLength, 1000)
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: checkFeesChanged - ReflectionToken: Fees exceeded max limitation", async () => {
        const feeTier = await reflectionToken.feeTier(1);
        const taxFee = MAX_FEE - sumFee(feeTier) + feeTier.taxFee.toNumber();
        await expect(
          reflectionToken.setTaxFeePercent(1, taxFee + 1)
        ).revertedWith("ReflectionToken: Fees exceeded max limitation");
      });

      it("Action: update taxFeePercent", async () => {
        // test feeTier 1
        const feeTier = await reflectionToken.feeTier(1);
        const taxFee = MAX_FEE - sumFee(feeTier) + feeTier.taxFee.toNumber();
        await reflectionToken.setTaxFeePercent(1, taxFee - 1);
        const newFeeTier = await reflectionToken.feeTier(1);
        await expect(newFeeTier.taxFee).equal(taxFee - 1);
        // reset ecoSystemFeePercent
        await reflectionToken.setTaxFeePercent(1, feeTier.taxFee);
      });
    });

    describe("- setOwnerFeePercent function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setOwnerFeePercent(1, 1000)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        const feeTierLength = await reflectionToken.feeTiersLength();
        await expect(
          reflectionToken.setOwnerFeePercent(feeTierLength, 1000)
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: checkFeesChanged - ReflectionToken: Fees exceeded max limitation", async () => {
        const feeTier = await reflectionToken.feeTier(1);
        const ownerFee =
          MAX_FEE - sumFee(feeTier) + feeTier.ownerFee.toNumber();
        await expect(
          reflectionToken.setOwnerFeePercent(1, ownerFee + 1)
        ).revertedWith("ReflectionToken: Fees exceeded max limitation");
      });

      it("Action: update ownerFeePercent", async () => {
        // test feeTier 1
        const feeTier = await reflectionToken.feeTier(1);
        const ownerFee =
          MAX_FEE - sumFee(feeTier) + feeTier.ownerFee.toNumber();
        await reflectionToken.setOwnerFeePercent(1, ownerFee - 1);
        const newFeeTier = await reflectionToken.feeTier(1);
        await expect(newFeeTier.ownerFee).equal(ownerFee - 1);
        // reset ecoSystemFeePercent
        await reflectionToken.setOwnerFeePercent(1, feeTier.ownerFee);
      });
    });

    describe("- setBurnFeePercent function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setBurnFeePercent(1, 1000)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        const feeTierLength = await reflectionToken.feeTiersLength();
        await expect(
          reflectionToken.setBurnFeePercent(feeTierLength, 1000)
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: checkFeesChanged - ReflectionToken: Fees exceeded max limitation", async () => {
        const feeTier = await reflectionToken.feeTier(1);
        const burnFee = MAX_FEE - sumFee(feeTier) + feeTier.burnFee.toNumber();
        await expect(
          reflectionToken.setBurnFeePercent(1, burnFee + 1)
        ).revertedWith("ReflectionToken: Fees exceeded max limitation");
      });
    });

    describe("- setEcoSystemFeeAddress function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken
            .connect(user1)
            .setEcoSystemFeeAddress(1, blockedUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        const feeTierLength = await reflectionToken.feeTiersLength();
        await expect(
          reflectionToken.setEcoSystemFeeAddress(
            feeTierLength,
            blockedUser.address
          )
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: check address - ReflectionToken: Address Zero is not allowed", async () => {
        await expect(
          reflectionToken.setEcoSystemFeeAddress(1, ZERO_ADDRESS)
        ).revertedWith("ReflectionToken: Address Zero is not allowed");
      });

      it("Action: update ecoSystem address", async () => {
        // test feeTier 1
        await reflectionToken.setEcoSystemFeeAddress(1, ecoSystem.address);
        const feeTier = await reflectionToken.feeTier(1);
        await expect(feeTier.ecoSystem).equal(ecoSystem.address);
      });
    });

    describe("- setOwnerFeeAddress function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken
            .connect(user1)
            .setOwnerFeeAddress(1, blockedUser.address)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Revert: checkTierIndex - ReflectionToken: Invalid tier index", async () => {
        const feeTierLength = await reflectionToken.feeTiersLength();
        await expect(
          reflectionToken.setOwnerFeeAddress(feeTierLength, blockedUser.address)
        ).revertedWith("ReflectionToken: Invalid tier index");
      });

      it("Revert: check address - ReflectionToken: Address Zero is not allowed", async () => {
        await expect(
          reflectionToken.setOwnerFeeAddress(1, ZERO_ADDRESS)
        ).revertedWith("ReflectionToken: Address Zero is not allowed");
      });

      it("Action: update feeOwner address", async () => {
        // test feeTier 2
        await reflectionToken.setOwnerFeeAddress(2, feeOwner.address);
        const feeTier = await reflectionToken.feeTier(2);
        await expect(feeTier.owner).equal(feeOwner.address);
      });
    });

    describe("- addTier function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken
            .connect(user1)
            .addTier(
              200,
              200,
              200,
              200,
              200,
              ecoSystem.address,
              feeOwner.address
            )
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: add a new feeTier", async () => {
        // test feeTier 2
        const oldFeeTierLength = await reflectionToken.feeTiersLength();
        const _feeTier = {
          ecoSystemFee: BN.from(200),
          liquidityFee: BN.from(200),
          taxFee: BN.from(200),
          ownerFee: BN.from(200),
          burnFee: BN.from(200),
          ecoSystem: ecoSystem.address,
          owner: feeOwner.address,
        };
        await reflectionToken.addTier(
          _feeTier.ecoSystemFee,
          _feeTier.liquidityFee,
          _feeTier.taxFee,
          _feeTier.ownerFee,
          _feeTier.burnFee,
          _feeTier.ecoSystem,
          _feeTier.owner
        );
        const newFeeTierLength = await reflectionToken.feeTiersLength();

        await expect(newFeeTierLength).equal(oldFeeTierLength.add(1));

        const feeTier = await reflectionToken.feeTier(oldFeeTierLength);

        checkFeeTier(feeTier, _feeTier);
      });
    });

    describe("- setMaxTxPercent function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setMaxTxPercent(1000)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: update maxTxAmount", async () => {
        const _tTotal = await reflectionToken.totalSupply();
        const maxTxPercent = BN.from(200);
        await reflectionToken.setMaxTxPercent(maxTxPercent);
        const _maxTxAmount = await reflectionToken.maxTxAmount();
        await expect(_maxTxAmount).equal(_tTotal.mul(maxTxPercent).div(10000));

        await updateMaxTxAmount();
      });
    });

    describe("- setDefaultSettings function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setDefaultSettings()
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: set defaultSettings", async () => {
        await reflectionToken.setDefaultSettings();
        await expect(await reflectionToken.swapAndEvolveEnabled()).to.be.equal(
          true
        );
      });
    });

    describe("- setSwapAndEvolveEnabled function", () => {
      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken.connect(user1).setSwapAndEvolveEnabled(false)
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: set defaultSettings", async () => {
        await reflectionToken.setSwapAndEvolveEnabled(false);
        await expect(await reflectionToken.swapAndEvolveEnabled()).to.be.equal(
          false
        );

        await reflectionToken.setSwapAndEvolveEnabled(true);
        await expect(await reflectionToken.swapAndEvolveEnabled()).to.be.equal(
          true
        );
      });
    });

    describe("- updateRouterAndPair function", () => {
      let mockWETH: MockERC20;
      let mockUniwapV2Router: MockUniswapV2Router;
      let mockUniswapPair: MockUniswapPair;

      before(async () => {
        // deploy mock contracts
        const erc20Factory = new MockERC20__factory(owner);
        mockWETH = await erc20Factory.deploy("WETH", "WETH");
        const mockUniswapV2RouterFactory = new MockUniswapV2Router__factory(
          owner
        );
        mockUniwapV2Router = await mockUniswapV2RouterFactory.deploy(
          mockWETH.address
        );
        const mockUniwswapPairFactory = new MockUniswapPair__factory(owner);
        mockUniswapPair = await mockUniwswapPairFactory.deploy();
      });

      it("Revert: Ownable: caller is not the owner", async () => {
        await expect(
          reflectionToken
            .connect(user1)
            .updateRouterAndPair(
              mockUniwapV2Router.address,
              mockUniswapPair.address
            )
        ).revertedWith("Ownable: caller is not the owner");
      });

      it("Action: set defaultSettings", async () => {
        await reflectionToken.updateRouterAndPair(
          mockUniwapV2Router.address,
          mockUniswapPair.address
        );
        await expect(await reflectionToken.uniswapV2Router()).to.be.equal(
          mockUniwapV2Router.address
        );
        await expect(await reflectionToken.uniswapV2Pair()).to.be.equal(
          mockUniswapPair.address
        );

        // reset uniswap address
        await reflectionToken.updateRouterAndPair(
          ROUTER_ADDRESS,
          uniswapV2PairAddress
        );
        await expect(await reflectionToken.uniswapV2Router()).to.be.equal(
          ROUTER_ADDRESS
        );
        await expect(await reflectionToken.uniswapV2Pair()).to.be.equal(
          uniswapV2PairAddress
        );
      });
    });
  });

  describe("4. Check ERC20 functions", () => {
    it("Transfer token", async () => {
      // disable swap
      await reflectionToken.setSwapAndEvolveEnabled(false);
      await reflectionToken.transfer(user1.address, OneToken.mul(1000000))
      let balanceOfUser1 = await reflectionToken.balanceOf(user1.address);
      await reflectionToken.connect(user1).transfer(user2.address, OneToken.mul(100000));
      balanceOfUser1 = await reflectionToken.balanceOf(user1.address);
    });
  });
});
