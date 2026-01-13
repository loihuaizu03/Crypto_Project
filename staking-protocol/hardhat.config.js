require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
            accounts: ["0xYOUR_PRIVATE_KEY"]
        }
    }
};
yunying