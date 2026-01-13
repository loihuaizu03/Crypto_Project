// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract Staking is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    uint256 public constant REWARD_RATE = 10; // 10% APR
    uint256 public constant SECONDS_IN_YEAR = 365 days;

    struct UserInfo {
        uint256 balance;
        uint256 lastUpdate;
        uint256 rewards;
    }

    mapping(address => UserInfo) public users;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    function _earned(address account) internal view returns (uint256) {
        UserInfo storage user = users[account];

        if (user.balance == 0) return user.rewards;

        uint256 timePassed = block.timestamp - user.lastUpdate;

        uint256 reward =
            (user.balance * REWARD_RATE * timePassed) /
            (100 * SECONDS_IN_YEAR);

        return user.rewards + reward;
    }


    function stake(uint256 amount) external nonReentrant {
        UserInfo storage user = users[msg.sender];

        user.rewards = _earned(msg.sender);
        user.lastUpdate = block.timestamp;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        user.balance += amount;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        UserInfo storage user = users[msg.sender];
        require(user.balance >= amount, "Not enough staked");

        user.rewards = _earned(msg.sender);
        user.lastUpdate = block.timestamp;
        user.balance -= amount;

        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        UserInfo storage user = users[msg.sender];

        uint256 reward = _earned(msg.sender);
        require(reward > 0, "No rewards");

        user.rewards = 0;
        user.lastUpdate = block.timestamp;

        stakingToken.safeTransfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    function stakedBalance(address userAddr) external view returns (uint256) {
        return users[userAddr].balance;
    }

    function pendingRewards(address userAddr) external view returns (uint256) {
        return _earned(userAddr);
    }
}
