/* eslint-disable no-process-exit */
import hre, {ethers, network, upgrades} from "hardhat";
import {ZERO_ADDRESS} from "../common/constants";

async function main(testing: boolean) {

    console.log(`Deploying STFILProtocolTimelock`)

    // deploying STFIL Protocol Timelock with a proxy
    const STFILProtocolTimelock = await ethers.getContractFactory('STFILProtocolTimelock.sol')

    // time lock in seconds
    const oneWeekInSeconds = 60 * 60 * 24 * 7
    const min_Delay = testing ? 30 : oneWeekInSeconds

    const timelock = await upgrades.deployProxy(STFILProtocolTimelock, [
        min_Delay,
        [], // proposers list is empty at deployment
        [ZERO_ADDRESS], // allow any address to execute a proposal once the timelock has expired
    ])
    await timelock.deployed()

    console.log(`Deployed to ${network.name} (${network.config.chainId})
    STFILProtocolTimelock proxy:  ${timelock.address}`)


    console.log(`Deploying STFILProtocolGovernor`)

    // deploying STFIL Protocol Governor with a proxy
    const STFILProtocolGovernor = await ethers.getContractFactory('STFILProtocolGovernor')

    // deploy governor proxy
    const votingPeriod = testing ? 20 : 45818 // 1 week
    const governor = await upgrades.deployProxy(STFILProtocolGovernor, [
        "0xxxx", // todo
        timelock.address,
    ])
    await governor.deployed()


    console.log(`Deployed to ${network.name} (${network.config.chainId})
    STFILProtocolGovernor proxy:  ${governor.address}`)

    // grant timelock roles to governor contract
    await timelock.grantRole(await timelock.EXECUTOR_ROLE(), governor.address);
    await timelock.grantRole(await timelock.PROPOSER_ROLE(), governor.address);
    await timelock.grantRole(await timelock.CANCELLER_ROLE(), governor.address);


    // deployer should renounced the Admin role after setup (leaving only Timelock as Admin)
    const [deployer] = await hre.ethers.getSigners()
    await timelock.renounceRole(timelock.TIMELOCK_ADMIN_ROLE(), deployer.address)

    console.log(`deployer recounced Admin Role.
        ${deployer.address} isAdmin: ${await timelock.hasRole(
            timelock.TIMELOCK_ADMIN_ROLE(),
            deployer.address
        )}`
    )

}

main(false)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })