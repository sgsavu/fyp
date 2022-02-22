// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RolesAndPermissions is AccessControl {
    
    enum ROLE_CLASS {
        MINTER,
        AUTHORITY
    }

    bytes32 internal constant ODOMETER_ROLE = keccak256("ODOMETER_ROLE");
    bytes32 internal constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 internal constant MINTER_ROLE_ADMIN = keccak256("MINTER_ROLE_ADMIN");
    bytes32 internal constant AUTHORITY_ROLE = keccak256("AUTHORITY_ROLE");
    bytes32 internal constant AUTHORITY_ROLE_ADMIN =
        keccak256("AUTHORITY_ROLE_ADMIN");


    constructor(){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE_ADMIN, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(AUTHORITY_ROLE_ADMIN, msg.sender);

        _setRoleAdmin(MINTER_ROLE_ADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(AUTHORITY_ROLE_ADMIN, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, MINTER_ROLE_ADMIN);
        _setRoleAdmin(AUTHORITY_ROLE, AUTHORITY_ROLE_ADMIN);
        _setRoleAdmin(ODOMETER_ROLE, AUTHORITY_ROLE_ADMIN);
    }

    
    modifier onlyClass(ROLE_CLASS class) {
        if (class == ROLE_CLASS.MINTER) {
            require(
                hasRole(MINTER_ROLE, msg.sender) ||
                    hasRole(MINTER_ROLE_ADMIN, msg.sender)
            );
        } else if (class == ROLE_CLASS.AUTHORITY) {
            require(
                hasRole(AUTHORITY_ROLE, msg.sender) ||
                    hasRole(AUTHORITY_ROLE_ADMIN, msg.sender)
            );
        }
        _;
    }

}
