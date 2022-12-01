import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";

require('dotenv').config();

const ALCHEMY_KEY = process.env.ALCHEMY_KEY || '';

const FORK = process.env.FORK || '';

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
        enabled: true,
        blockNumber: 16063759
      }
    }
  },
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

};

export default config;
