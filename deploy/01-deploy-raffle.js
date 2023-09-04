const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

const deploy = async ({ getNamedAccounts, deployments }) => {
  let vrfCoordinatorV2Address;
  const chainId = network.config.chainId;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2 = await ethers.getContractFactory(
      "vrfCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2.address;
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
  }
  const entranceFee = networkConfig[chainId]["entranceFee"];

  const args = [vrfCoordinatorV2Address, entranceFee];
  const raffle = await deploy("Raffle", {
    from: deployer,
    log: true,
    args: args,
    confirmations: network.config.waitForConfirmations || 1,
  });
  log(`Contract deployed at ${raffle.target}`);
};

module.exports = deploy;
