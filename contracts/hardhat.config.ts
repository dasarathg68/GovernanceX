import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
import { NetworksUserConfig } from "hardhat/types";

dotenv.config();
let networks: NetworksUserConfig = {
  hardhat: {},
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        // Toggles whether the optimizer is on or off.
        // It's good to keep it off for development
        // and turn on for when getting ready to launch.
        enabled: true,
        // The number of runs specifies roughly how often
        // the deployed code will be executed across the
        // life-time of the contract.
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: networks,
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_KEY,
    token: "MATIC",
  },
};

export default config;
