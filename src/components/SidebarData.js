import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
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
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];