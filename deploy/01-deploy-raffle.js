const { network } = require("hardhat");

const deploy = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const raffle = await deploy("Raffle", {
    deployer: deployer,
    log: true,
    args: [],
    confirmations: network.config.waitForConfirmations || 1,
  });
};

module.exports = deploy;
