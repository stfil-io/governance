// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";

contract STFILProtocolTimelock is TimelockControllerUpgradeable {
    function initialize(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) public initializer {
        __TimelockController_init(
            minDelay,
            proposers,
            executors,
            msg.sender
        );
    }
}
