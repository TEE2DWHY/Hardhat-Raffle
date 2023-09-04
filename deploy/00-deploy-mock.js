const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const BASE_FEE = ethers.utils.parseEther("0.25"); // it is premium. it cost 0.25 link link per request.
const GAS_PRICE_LINK = 1e9; // link per gas
const deployMock = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = getNamedAccounts();
  const args = [BASE_FEE, GAS_PRICE_LINK];
  if (developmentChains.includes(network.name)) {
    console.log("Local network detected...deploying mocks");
    await deploy("vrfCoordinatorV2MockV2", {
      from: deployer,
      contract: "MockV3Aggregator",
      log: true,
      args: [args],
    });
    log("Mocks Deployed");
    log("-------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
