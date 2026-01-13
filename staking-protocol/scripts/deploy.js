const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with:", deployer.address);

    // 1Deploy ERC-20 token
    const StakeToken = await hre.ethers.getContractFactory("StakeToken");
    const stakeToken = await StakeToken.deploy(
        hre.ethers.parseEther("1000000") // 1 million STK
    );
    await stakeToken.waitForDeployment();

    console.log("StakeToken deployed to:", await stakeToken.getAddress());

    // Deploy Staking contract
    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(await stakeToken.getAddress());
    await staking.waitForDeployment();

    console.log("Staking contract deployed to:", await staking.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
