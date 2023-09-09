const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verifyContract } = require("../utils/verify");
const VRF_SUB_AMOUNT = ethers.utils.parseEther("2");

module.exports = async ({ getNamedAccounts, deployments }) => {
  let VRFCoordinatorV2Address, subscriptionId;
  const chainId = network.config.chainId;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (developmentChains.includes(network.name)) {
    const VRFCoordinatorV2 = await ethers.getContractAt("VRFCoordinatorV2Mock");
    VRFCoordinatorV2Address = VRFCoordinatorV2.address;
    const transactionResponse = await VRFCoordinatorV2.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId;
    // Fund Subscription
    // Usually we would need link token on a real network
    await VRFCoordinatorV2.fundSubscription(subscriptionId, VRF_SUB_AMOUNT);
  } else {
    VRFCoordinatorV2Address = networkConfig[chainId]["VRFCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }
  const entranceFee = networkConfig[chainId]["entranceFee"];
  const gasLane = networkConfig[chainId]["gasLane"];
  const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"];
  const interval = networkConfig[chainId]["interval"];
  const args = [
    VRFCoordinatorV2Address,
    entranceFee,
    gasLane,
    subscriptionId,
    callBackGasLimit,
    interval,
  ];
  const raffle = await deploy("Raffle", {
    from: deployer,
    log: true,
    args: args,
    confirmations: network.config.waitForConfirmations || 1,
  });
  log(`Contract deployed at ${raffle.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying....");
    await verifyContract(raffle.address);
  }
  log("--------------------------------------");
};

module.exports.tags = ["all", "raffle"];
