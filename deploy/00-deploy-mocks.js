const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    //from the hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        // if our network is one of the dev chains
        // or if (chainId == "31337")
        // if we are on a development chain
        log("Local network detected! Deploying mocks!")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER], // pass these to constructor
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
