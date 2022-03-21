// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Roles.sol";

/*
This contract is used to manage the IoT devices/odometers
It can dictate the odomters to refresh the cache, to restart themselves or
to even change the api address that they are fetching from.
*/
contract Management {
  
    bool private refreshCache = false;
    bool private restart = false;
    string private apiAddress = "localhost:8443";

    Roles r;

    constructor (address addr) {
        r = Roles(addr);
    }

    modifier onlyAuthorized() {
        require(r.hasRole(r.DEFAULT_ADMIN_ROLE(), msg.sender));
        _;
    }

    function getRefreshCache() external view returns (bool) {
        return refreshCache;
    }

    function getRestart() external view returns (bool) {
        return restart;
    }

    function getApiAddress() external view returns (string memory)  {
        return apiAddress;
    }

    function setRefreshCache(bool value) external onlyAuthorized() {
        refreshCache = value;
    }

    function setRestart(bool value) external onlyAuthorized() {
        restart = value;
    }

    function setApiAddress(string memory value) external onlyAuthorized() {
        apiAddress = value;
    }
    
}
