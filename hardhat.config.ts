import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer"
// import "./tasks";
import {useEnv} from "./common/env";
import 'solidity-coverage'
import 'hardhat-gas-reporter'

const DEPLOYER = useEnv("DEPLOYER");

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.17',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        calibration: {
            chainId: 314159,
            url: useEnv("NETWORK_GATEWAY"),
            accounts: [DEPLOYER],
        },
        mainnet: {
            chainId: 314,
            url: useEnv("NETWORK_GATEWAY"),
            accounts: [DEPLOYER],
        }
    },
    gasReporter: {
        enabled: true,
    },
};

export default config;

