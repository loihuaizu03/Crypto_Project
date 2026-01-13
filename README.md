🥩 Staking Protocol (Solidity)

A simple ERC-20 staking smart contract built with Solidity and Hardhat.
Users can stake tokens, earn time-based rewards, and claim rewards securely.

This project currently focuses on the core staking logic and is designed to be extended with additional DeFi features in the future.

🚀 Features (Current)

✅ Stake ERC-20 tokens

✅ Earn rewards based on staking duration

✅ Claim accumulated rewards

✅ View staked balance

✅ View pending rewards

✅ Protection against reentrancy attacks

✅ Automated tests using Mocha & Chai

🧠 Smart Contract Overview
Core Components

ERC-20 Token Support

Uses OpenZeppelin IERC20 and SafeERC20

Reentrancy Protection

Uses ReentrancyGuard

Time-based Reward Calculation

Rewards accumulate based on:

staking duration × staked amount × reward rate
