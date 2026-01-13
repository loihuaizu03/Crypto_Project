const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking Contract", function () {
    let stakeToken;
    let staking;
    let deployer, user1, user2;

    const INITIAL_SUPPLY = ethers.parseEther("1000000");
    const STAKE_AMOUNT = ethers.parseEther("100");
    const REWARD_POOL = ethers.parseEther("10000");

    beforeEach(async function () {
        [deployer, user1, user2] = await ethers.getSigners();

        // Deploy ERC20
        const StakeToken = await ethers.getContractFactory("StakeToken");
        stakeToken = await StakeToken.deploy(INITIAL_SUPPLY);

        // Deploy Staking
        const Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(stakeToken.target);

        // Fund reward pool
        await stakeToken.transfer(staking.target, REWARD_POOL);

        // Give tokens to users
        await stakeToken.transfer(user1.address, STAKE_AMOUNT);
        await stakeToken.transfer(user2.address, STAKE_AMOUNT);
    });

    it("User can stake tokens", async function () {
        await stakeToken.connect(user1).approve(staking.target, STAKE_AMOUNT);
        await staking.connect(user1).stake(STAKE_AMOUNT);

        expect(await staking.stakedBalance(user1.address)).to.equal(STAKE_AMOUNT);
    });

    it("Rewards increase over time", async function () {
        await stakeToken.connect(user1).approve(staking.target, STAKE_AMOUNT);
        await staking.connect(user1).stake(STAKE_AMOUNT);

        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        const rewards = await staking.pendingRewards(user1.address);
        expect(rewards).to.be.gt(0);
    });

    it("User can claim rewards", async function () {
        await stakeToken.connect(user1).approve(staking.target, STAKE_AMOUNT);
        await staking.connect(user1).stake(STAKE_AMOUNT);

        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        const before = await stakeToken.balanceOf(user1.address);
        await staking.connect(user1).claimRewards();
        const after = await stakeToken.balanceOf(user1.address);

        expect(after).to.be.gt(before);
    });

    it("User can withdraw staked tokens", async function () {
        await stakeToken.connect(user1).approve(staking.target, STAKE_AMOUNT);
        await staking.connect(user1).stake(STAKE_AMOUNT);

        await staking.connect(user1).withdraw(STAKE_AMOUNT);

        expect(await staking.stakedBalance(user1.address)).to.equal(0);
    });

    it("Earlier staker earns more than later staker", async function () {
        // user1 stakes first
        await stakeToken.connect(user1).approve(staking.target, STAKE_AMOUNT);
        await staking.connect(user1).stake(STAKE_AMOUNT);

        await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        // user2 stakes later
        await stakeToken.connect(user2).approve(staking.target, STAKE_AMOUNT);
        await staking.connect(user2).stake(STAKE_AMOUNT);

        await ethers.provider.send("evm_increaseTime", [4 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        const reward1 = await staking.pendingRewards(user1.address);
        const reward2 = await staking.pendingRewards(user2.address);

        expect(reward1).to.be.gt(reward2);
    });
});
