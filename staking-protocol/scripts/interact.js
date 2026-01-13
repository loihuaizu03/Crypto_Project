const hre = require("hardhat");

async function main() {
    const [deployer, user1, user2] = await hre.ethers.getSigners();

    console.log("Deployer:", deployer.address);
    console.log("User1 (staker):", user1.address);
    console.log("User2 (idle):", user2.address);

    // Replace with YOUR deployed addresses
    const stakeTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const stakingAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const StakeToken = await hre.ethers.getContractAt("StakeToken", stakeTokenAddress);
    const Staking = await hre.ethers.getContractAt("Staking", stakingAddress);

    const stakeAmount = hre.ethers.parseEther("100");

    console.log("Funding reward pool...");
    await StakeToken.connect(deployer).transfer(
        stakingAddress,
        hre.ethers.parseEther("10000")
    );

    console.log("Sending tokens to users...");
    await StakeToken.connect(deployer).transfer(user1.address, stakeAmount);
    await StakeToken.connect(deployer).transfer(user2.address, stakeAmount);

    console.log("User1 approves & stakes");
    await StakeToken.connect(user1).approve(stakingAddress, stakeAmount);
    await Staking.connect(user1).stake(stakeAmount);

    // advance 3 days
    await hre.ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
    await hre.ethers.provider.send("evm_mine");

    console.log("User2 approves & stakes (later)");
    await StakeToken.connect(user2).approve(stakingAddress, stakeAmount);
    await Staking.connect(user2).stake(stakeAmount);

    // advance 4 more days (total 7)
    await hre.ethers.provider.send("evm_increaseTime", [4 * 24 * 60 * 60]);
    await hre.ethers.provider.send("evm_mine");

    console.log("Both users claim rewards");
    await Staking.connect(user1).claimRewards();
    await Staking.connect(user2).claimRewards();

    console.log("Users withdraw staked tokens");

    await Staking.connect(user1).withdraw(stakeAmount);
    await Staking.connect(user2).withdraw(stakeAmount);

    const u1Bal = await StakeToken.balanceOf(user1.address);
    const u2Bal = await StakeToken.balanceOf(user2.address);

    console.log("Final balances:");
    console.log("User1:", hre.ethers.formatEther(u1Bal));
    console.log("User2:", hre.ethers.formatEther(u2Bal));
}

main().catch(console.error);