const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

//takes hre
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //  const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    //need a mock when on hardhat/localhost

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        // are we on local/hardhat?
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // gets last deployed contract
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("----------------------------------------")
}

module.exports.tags = ["all", "fundme"]
