import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';


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


export const Sidebars = {
  USER: UserSidebar,
  MINTER: MinterSidebar,
  AUTHORITY: AuthoritySidebar,
  MINTER_ADMIN: MinterAdminSidebar,
  AUTHORIT_ADMIN: AuthorityAdminSidebar,
  DEFAULT_ADMIN: AdminSidebar
}




