const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", async () => {
      let raffle, vrfCoordinatorMockV2, raffleEntranceFee, deployer;
      const chainId = network.config.chainId;
      beforeEach(async () => {
        deployer = await getNamedAccounts().deployer;
        await deployments.fixture(["all"]);
        raffle = await ethers.getContractAt("Raffle", deployer);
        vrfCoordinatorMockV2 = await ethers.getContractAt(
          "VRFCoordinatorV2Mock",
          deployer
        );
        raffleEntranceFee = await raffle.getEntranceFee();
      });
      describe("constructor", async function () {
        it("initializes raffle correctly", async () => {
          const raffleState = await raffle.getRaffleState();
          const interval = await raffle.getInterval();
          assert.equal(raffleState.toString(), 0);
          assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
        });
      });
      describe("enterRaffle", async function () {
        it("reverts if you don't pay enough", async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            "Raffle__NotEnoughtETH();"
          );
        });
        it("records players when they enter", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer(0);
          assert.equal(playerFromContract, deployer);
        });
        it("emits event on enter", async () => {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(
            // emits RaffleEnter event if entered to index player(s) address
            raffle,
            "RaffleEnter"
          );
        });
      });
    });
