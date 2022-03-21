import { Sidebar } from '../navigation/SidebarData';

const keccak256 = require('keccak256')

/**
 * MASTER OBJECT of the roles in the app
 */
export const roles = {
  DEFAULT_ADMIN_ROLE: "0x00",
  MINTER_ROLE_ADMIN: keccak256("MINTER_ROLE_ADMIN"),
  AUTHORITY_ROLE_ADMIN: keccak256("AUTHORITY_ROLE_ADMIN"),
  MINTER_ROLE: keccak256("MINTER_ROLE"),
  AUTHORITY_ROLE: keccak256("AUTHORITY_ROLE"),
  USER_ROLE: keccak256("USER_ROLE"),
  VIEWER_ROLE: keccak256("VIEWER_ROLE"),
  ODOMETER_ROLE: keccak256("ODOMETER_ROLE"),
  GARAGE_ROLE: keccak256("GARAGE_ROLE")
}

export const actions = {
  GIVE: "grantRole",
  REVOKE: "revokeRole",
}

/**
 * The admin options for the DEFAULT_ADMIN_ROLE
 */
const DEFAULT_ADMIN_OPTIONS = {
  roleManaging: {
    actions: [actions.GIVE, actions.REVOKE],
    roles: (({ MINTER_ROLE, MINTER_ROLE_ADMIN, AUTHORITY_ROLE, AUTHORITY_ROLE_ADMIN, ODOMETER_ROLE }) => ({ MINTER_ROLE, MINTER_ROLE_ADMIN, AUTHORITY_ROLE, AUTHORITY_ROLE_ADMIN, ODOMETER_ROLE }))(roles)
  },
  vehicleBurning: true,
  setOdometers: true
}

/**
 * The admin options for the MINTER_ADMIN_ROLE
 */
const MINTER_ADMIN_OPTIONS = {
  roleManaging: {
    actions: [actions.GIVE, actions.REVOKE],
    roles: (({ MINTER_ROLE }) => ({ MINTER_ROLE }))(roles)
  } ,
  vehicleBurning: false,
  setOdometers: false
} 

const AUTHORITY_ADMIN_OPTIONS = {
  roleManaging: {
    actions: [actions.GIVE, actions.REVOKE],
    roles: (({ AUTHORITY_ROLE, ODOMETER_ROLE }) => ({ AUTHORITY_ROLE, ODOMETER_ROLE }))(roles)
  },
  vehicleBurning: true,
  setOdometers: true,
}

const EMPTY_OPTIONS = {
  actions: [],
  roles: []
}

export const superUsers = [roles.DEFAULT_ADMIN_ROLE, roles.AUTHORITY_ROLE, roles.AUTHORITY_ROLE_ADMIN]


/**
 * Returns the admin options for the role provided.
 * This is used in combination with the role the user is
 * assigned in the app.
 * @param role the role of the user
 * @returns {Object} object with the options
 */
export const getAdminOptionsFor = (role) => {
  switch (role) {
    case roles.MINTER_ROLE_ADMIN:
      return MINTER_ADMIN_OPTIONS
    case roles.AUTHORITY_ROLE_ADMIN:
      return AUTHORITY_ADMIN_OPTIONS
    case roles.DEFAULT_ADMIN_ROLE:
      return DEFAULT_ADMIN_OPTIONS
    default:
      return EMPTY_OPTIONS
  }
}

/**
 * Returns the appropriate sidebar for each role.
 * This is used in combination with the role the user is
 * assigned in the app.
 * @param the role of the user
 * @returns {Object} sidebar object
 */
export const getSidebarFor = (role) => {
  switch (role) {
    case roles.VIEWER_ROLE:
      return Sidebar.VIEWER
    case roles.USER_ROLE:
      return Sidebar.USER
    case roles.AUTHORITY_ROLE:
      return Sidebar.AUTHORITY
    case roles.MINTER_ROLE:
      return Sidebar.MINTER
    case roles.DEFAULT_ADMIN_ROLE:
      return Sidebar.DEFAULT_ADMIN
    case roles.MINTER_ROLE_ADMIN:
      return Sidebar.MINTER_ADMIN
    case roles.AUTHORITY_ROLE_ADMIN:
      return Sidebar.AUTHORITY_ADMIN
      case roles.GARAGE_ROLE:
        return Sidebar.GARAGE
  }
}


const pageAccess = {
  EDIT: [roles.GARAGE_ROLE],
  GARAGE: [roles.GARAGE_ROLE],
  MINT: [roles.MINTER_ROLE, roles.MINTER_ROLE_ADMIN, roles.DEFAULT_ADMIN_ROLE],
  VERIFY: [roles.AUTHORITY_ROLE, roles.AUTHORITY_ROLE_ADMIN, roles.DEFAULT_ADMIN_ROLE],
  ADMIN: [roles.MINTER_ROLE_ADMIN, roles.AUTHORITY_ROLE_ADMIN, roles.DEFAULT_ADMIN_ROLE]
}

/**
 * Checks if the path being accessed is accessible to the user provided
 * @param pathBeingAccessed the path we are trying to access
 * @param userRole the role of the user
 * @returns {boolean}
 */
export const checkRoutePermissionFor = (pathBeingAccessed, userRole) => {
  switch (pathBeingAccessed) {
    case "/admin":
      return pageAccess.ADMIN.some(allowedRole => allowedRole == userRole)
    case "/mint":
      return pageAccess.MINT.some(allowedRole => allowedRole == userRole)
    case "/verify":
      return pageAccess.VERIFY.some(allowedRole => allowedRole == userRole)
    default:
      return true
  }
}
