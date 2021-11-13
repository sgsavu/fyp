
  import React from 'react';
  import * as FaIcons from 'react-icons/fa';
  import * as AiIcons from 'react-icons/ai';
  import * as IoIcons from 'react-icons/io';
  
const keccak256 = require('keccak256')

export const actions = {
	GIVE: keccak256("GIVE"),
	REVOKE: keccak256("REVOKE"),
}

export const roles = {
    DEFAULT_ADMIN_ROLE: "0x00",
    MINTER_ROLE_ADMIN: keccak256("MINTER_ROLE_ADMIN"),
    AUTHORITY_ROLE_ADMIN: keccak256("AUTHORITY_ROLE_ADMIN"),
    MINTER_ROLE: keccak256("MINTER_ROLE"),
    AUTHORITY_ROLE: keccak256("AUTHORITY_ROLE"),
    USER_ROLE: keccak256("USER_ROLE")
}

export const getNumberOfRoles = () => {
    return Object.keys(roles).length
}

const MINTER_ROLE_ADMIN_PERMISSIONS = {
  actions: [actions.GIVE,actions.REVOKE],
  roles: [roles.MINTER_ROLE]
}

const AUTHORITY_ROLE_ADMIN_PERMISSIONS = {
  actions: [actions.GIVE,actions.REVOKE],
  roles: [roles.AUTHORITY_ROLE]
}

const DEFAULT_ADMIN_ROLE_PERMISSIONS = {
  actions: [actions.GIVE,actions.REVOKE],
  roles: [roles.AUTHORITY_ROLE,roles.MINTER_ROLE,roles.MINTER_ROLE_ADMIN,roles.AUTHORITY_ROLE_ADMIN]
}

const EMPTY_PERMISSIONS = {
    actions: [],
    roles: []
}

export const getAdminPanelPermissions = (role) => {

    switch (role){
        case roles.MINTER_ROLE_ADMIN:
            return MINTER_ROLE_ADMIN_PERMISSIONS
        case roles.AUTHORITY_ROLE_ADMIN:
            return AUTHORITY_ROLE_ADMIN_PERMISSIONS
        case roles.DEFAULT_ADMIN_ROLE:
            return DEFAULT_ADMIN_ROLE_PERMISSIONS
        default:
            return EMPTY_PERMISSIONS
    }

}

export const getSidebarForRole = (role) => {

    switch (role) {
      case roles.USER_ROLE:
        return UserSidebar
      case roles.AUTHORITY_ROLE:
        return AuthoritySidebar
      case roles.MINTER_ROLE:
        return MinterSidebar
      case roles.DEFAULT_ADMIN_ROLE:
        return AdminSidebar
      case roles.MINTER_ROLE_ADMIN:
        return MinterAdminSidebar
      case roles.AUTHORITY_ROLE_ADMIN:
        return AuthorityAdminSidebar
    }
  
  }

  
  const UserSidebar = [
    {
      title: 'My Vehicles',
      path: '/',
      icon: <AiIcons.AiFillCar />,
      cName: 'nav-text'
    },
    {
      title: 'Vehicle Marketplace',
      path: '/marketplace',
      icon: <FaIcons.FaShoppingBag />,
      cName: 'nav-text'
    },
    {
      title: 'Support',
      path: '/support',
      icon: <IoIcons.IoMdHelpCircle />,
      cName: 'nav-text'
    }
  ];
  
  const AuthoritySidebar = [
    ...UserSidebar,
    {
      title: 'Verify Ownership',
      path: '/verify',
      icon: <FaIcons.FaCheck />,
      cName: 'nav-text'
    }
  ];
  
  const AuthorityAdminSidebar = [
    ...AuthoritySidebar,
    {
      title: 'Admin',
      path: '/admin',
      icon: <AiIcons.AiFillWarning />,
      cName: 'nav-text'
    }
  ];
  
  const MinterSidebar = [
    ...UserSidebar,
    {
      title: 'Mint Vehicle',
      path: '/mint',
      icon: <FaIcons.FaPlusCircle />,
      cName: 'nav-text'
    }
  ];
  
  const MinterAdminSidebar = [
    ...MinterSidebar,
    {
      title: 'Admin',
      path: '/admin',
      icon: <AiIcons.AiFillWarning />,
      cName: 'nav-text'
    }
  ];
  
  const AdminSidebar = [
    ...UserSidebar,
    {
      title: 'Verify Ownership',
      path: '/verify',
      icon: <FaIcons.FaCheck />,
      cName: 'nav-text'
    },
    {
      title: 'Mint Vehicle',
      path: '/mint',
      icon: <FaIcons.FaPlusCircle />,
      cName: 'nav-text'
    },
    {
      title: 'Admin',
      path: '/admin',
      icon: <AiIcons.AiFillWarning />,
      cName: 'nav-text'
    }
  ];