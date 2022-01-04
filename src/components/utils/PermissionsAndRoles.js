
import { Sidebar } from '../navigation/SidebarData';

const keccak256 = require('keccak256')

export const actions = {
  GIVE: "GIVE",
  REVOKE: "REVOKE",
}

export const roles = {
  DEFAULT_ADMIN_ROLE: "0x00",
  MINTER_ROLE_ADMIN: keccak256("MINTER_ROLE_ADMIN"),
  AUTHORITY_ROLE_ADMIN: keccak256("AUTHORITY_ROLE_ADMIN"),
  MINTER_ROLE: keccak256("MINTER_ROLE"),
  AUTHORITY_ROLE: keccak256("AUTHORITY_ROLE"),
  USER_ROLE: keccak256("USER_ROLE"),
  VIEWER_ROLE: keccak256("VIEWER_ROLE")
}

export const string_roles = {
  DEFAULT_ADMIN_ROLE: "DEFAULT_ADMIN_ROLE",
  MINTER_ROLE_ADMIN: "MINTER_ROLE_ADMIN",
  AUTHORITY_ROLE_ADMIN: "AUTHORITY_ROLE_ADMIN",
  MINTER_ROLE: "MINTER_ROLE",
  AUTHORITY_ROLE: "AUTHORITY_ROLE",
  USER_ROLE: "USER_ROLE"
}

export const getNumberOfRoles = () => {
  return Object.keys(roles).length
}

export const roleToString = (role) => {
  switch (role) {
    case roles.MINTER_ROLE_ADMIN:
      return "MINTER_ROLE_ADMIN"
    case roles.AUTHORITY_ROLE_ADMIN:
      return "AUTHORITY_ROLE_ADMIN"
    case roles.MINTER_ROLE:
      return "MINTER_ROLE"
    case roles.AUTHORITY_ROLE:
      return "AUTHORITY_ROLE"
    case roles.DEFAULT_ADMIN_ROLE:
      return "DEFAULT_ADMIN_ROLE"
    case roles.USER_ROLE:
      return "USER_ROLE"
    default:
      return "NEW*(not defined)" + role
  }
}

const pageAccess = {
  MINT: [roles.MINTER_ROLE, roles.MINTER_ROLE_ADMIN, roles.DEFAULT_ADMIN_ROLE],
  VERIFY: [roles.AUTHORITY_ROLE, roles.AUTHORITY_ROLE_ADMIN, roles.DEFAULT_ADMIN_ROLE],
  ADMIN: [roles.MINTER_ROLE_ADMIN, roles.AUTHORITY_ROLE_ADMIN, roles.DEFAULT_ADMIN_ROLE]
}


const MINTER_ADMIN_OPTIONS = {
  actions: [actions.GIVE, actions.REVOKE],
  roles: [string_roles.MINTER_ROLE]
}

const AUTHORITY_ADMIN_OPTIONS = {
  actions: [actions.GIVE, actions.REVOKE],
  roles: [string_roles.AUTHORITY_ROLE]
}

const DEFAULT_ADMIN_OPTIONS = {
  actions: [actions.GIVE, actions.REVOKE],
  roles: [string_roles.AUTHORITY_ROLE, string_roles.MINTER_ROLE, string_roles.MINTER_ROLE_ADMIN, string_roles.AUTHORITY_ROLE_ADMIN]
}

const EMPTY_OPTIONS = {
  actions: [],
  roles: []
}

export const superUsers = [roles.DEFAULT_ADMIN_ROLE,roles.AUTHORITY_ROLE,roles.AUTHORITY_ROLE_ADMIN]


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
  }
}

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
