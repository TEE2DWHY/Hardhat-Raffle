require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    goerli: {
      url: GOERLI_URL,
      chainId: 5,
      blockConfirmations: 6,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: {
    compilers: [{ version: "0.8.19" }, { version: "0.8" }],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  mocha: {
    timeout: 500000, // 500 seconds max for running tests
  },
};

// This is the code to redeploy to the same contract: npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 2" ...
// Replace DEPLOYED_CONTRACT_ADDRESS with the actual address of your deployed contract and provide any constructor arguments if your contract has them.
