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

const DefaultAdminSidebar = [
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

export const Sidebar = {
    USER: UserSidebar,
    AUTHORITY: AuthoritySidebar,
    AUTHORITY_ADMIN: AuthorityAdminSidebar,
    MINTER: MinterSidebar,
    MINTER_ADMIN: MinterAdminSidebar,
    DEFAULT_ADMIN: DefaultAdminSidebar
}