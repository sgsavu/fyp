// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract Odometer {
    
    mapping(uint256 => address) internal _odometerAddress;
    mapping(uint256 => uint256) internal _odometerValue;
    
    
    function getOdometerValue(uint256 tokenId) external view returns (uint256) {
        return _odometerValue[tokenId];
    }

    function increaseOdometer(uint256 tokenId, uint256 value)
        external
        ///onlyRole(ODOMETER_ROLE)
    {
        require(msg.sender == _odometerAddress[tokenId]);
        _odometerValue[tokenId] = _odometerValue[tokenId] + value;
    }

    function setOdometerAddress(uint256 tokenId, address odometer)
        external
        ///onlyRole(AUTHORITY_ROLE_ADMIN)
    {
        _odometerAddress[tokenId] = odometer;
    }

}
