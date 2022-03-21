// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Roles.sol";

/*
This contract manages and keeps track of each vehicles odomter.
Only odometers can increment thevalue of each vehicle.
*/
contract Odometer {
    
    mapping(uint256 => address) internal _odometerAddress;
    mapping(uint256 => uint256) internal _odometerValue;
    
    Roles r;

    constructor (address addr) {
        r = Roles(addr);
    }
 
    function getOdometerValue(uint256 tokenId) external view returns (uint256) {
        return _odometerValue[tokenId];
    }

    function increaseOdometer(uint256 tokenId, uint256 value)
        external
    {
        require (r.hasRole(r.ODOMETER_ROLE(), msg.sender));
        require(msg.sender == _odometerAddress[tokenId]);
        _odometerValue[tokenId] = _odometerValue[tokenId] + value;
    }

    function setOdometerAddress(uint256 tokenId, address odometer)
        external
    {   
        require (r.hasRole(r.AUTHORITY_ROLE_ADMIN(), msg.sender));
        _odometerAddress[tokenId] = odometer;
    }

}
