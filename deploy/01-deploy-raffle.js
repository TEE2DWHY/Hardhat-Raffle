const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const verifyContract = require("../utils/verify");
const VRF_SUB_AMOUNT = ethers.utils.parseEther("2");

module.exports = async ({ getNamedAccounts, deployments }) => {
  let VRFCoordinatorV2Address, subscriptionId, VRFCoordinatorV2Mock;
  const chainId = network.config.chainId;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (chainId == 31337) {
    VRFCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock");
    VRFCoordinatorV2Address = VRFCoordinatorV2Mock.address;
    const transactionResponse = await VRFCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.events[0].args.subId;
    // Fund Subscription
    // Usually we would need link token on a real network
    await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_AMOUNT);
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
