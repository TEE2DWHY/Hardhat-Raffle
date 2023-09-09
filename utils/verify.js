const { run } = require("hardhat");

const verifyContract = async (contractAddress) => {
  try {
    await run("verify", {
      address: contractAddress,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("already verified");
    } else {
      console.log(error.message);
    }
  }
};

module.exports = verifyContract;
