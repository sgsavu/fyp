// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title The roles and permissions contract
/// @notice It manages access throughout the ecosystem. 
///         Has to be deployed as the first contract.
contract Roles is AccessControl {
   
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MINTER_ROLE_ADMIN =
        keccak256("MINTER_ROLE_ADMIN");
    bytes32 public constant AUTHORITY_ROLE = keccak256("AUTHORITY_ROLE");
    bytes32 public constant AUTHORITY_ROLE_ADMIN =
        keccak256("AUTHORITY_ROLE_ADMIN");
    bytes32 public constant ODOMETER_ROLE = keccak256("ODOMETER_ROLE");
    bytes32 public constant GARAGE_ROLE = keccak256("GARAGE_ROLE");

    ///@dev The first 4 lines make the deployer of this contract a
    ///     DEFAULT_ADMIN, MINTER_ADMIN, MINTER and a AUTHORITY_ADMIN.
    ///     The rest set up the hierarchy of the ecosystem with each role
    ///     obtaining privileges over others.
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE_ADMIN, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(AUTHORITY_ROLE_ADMIN, msg.sender);
        _setRoleAdmin(MINTER_ROLE_ADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(AUTHORITY_ROLE_ADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, MINTER_ROLE_ADMIN);
        _setRoleAdmin(AUTHORITY_ROLE, AUTHORITY_ROLE_ADMIN);
        _setRoleAdmin(ODOMETER_ROLE, AUTHORITY_ROLE_ADMIN);
        _setRoleAdmin(GARAGE_ROLE, MINTER_ROLE_ADMIN);
    }

    ///@dev Checks if the addr is any type of MINTER_ROLE
    function isMinterClass(address addr) external view returns (bool) {
        if (hasRole(MINTER_ROLE, addr) ||
                hasRole(MINTER_ROLE_ADMIN, addr))
            return true;
        
        return false;
    }

    ///@dev Checks if the addr is any type of AUTHORITY_ROLE
    function isAuthorityClass(address addr) external view returns (bool) {
        if (hasRole(AUTHORITY_ROLE, addr) ||
                hasRole(AUTHORITY_ROLE_ADMIN, addr))
            return true;
        
        return false;
    }
}
