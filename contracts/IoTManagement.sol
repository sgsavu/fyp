// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract IoTManagement {
  
    bool private refreshCache = false;
    bool private restart = false;
    string private apiAddress = "localhost:8443";
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
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

    function setRefreshCache(bool value) external onlyOwner() {
        refreshCache = value;
    }

    function setRestart(bool value) external onlyOwner() {
        restart = value;
    }

    function setApiAddress(string memory value) external onlyOwner() {
        apiAddress = value;
    }
    
}
