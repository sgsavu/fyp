import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';


const ViewerSidebar = [
    {
        title: 'Market',
        path: '/',
        icon: <FaIcons.FaShoppingBag />,
        cName: 'nav-text'
    }
]


const UserSidebar = [
    ...ViewerSidebar,
    {
        title: 'My Vehicles',
        path: '/myvehicles',
        icon: <AiIcons.AiFillCar />,
        cName: 'nav-text'
    },
    {
        title: 'Garage',
        path: '/garage',
        icon: <FaIcons.FaTools />,
        cName: 'nav-text'
    },
];

const AuthoritySidebar = [
    ...UserSidebar,
    {
        title: 'Verify',
        path: '/verify',
        icon: <FaIcons.FaCheck />,
        cName: 'nav-text'
    }
];

const AdminSidebar =
{
    title: 'Admin',
    path: '/admin',
    icon: <AiIcons.AiFillWarning />,
    cName: 'nav-text'
}

const AuthorityAdminSidebar = [
    ...AuthoritySidebar,
    AdminSidebar
];

const MinterSidebar = [
    ...UserSidebar,
    {
        title: 'Mint',
        path: '/mint',
        icon: <FaIcons.FaPlusCircle />,
        cName: 'nav-text'
    }
];

const MinterAdminSidebar = [
    ...MinterSidebar,
    AdminSidebar
];

const DefaultAdminSidebar = [
    ...UserSidebar,
    {
        title: 'Verify',
        path: '/verify',
        icon: <FaIcons.FaCheck />,
        cName: 'nav-text'
    },
    {
        title: 'Mint',
        path: '/mint',
        icon: <FaIcons.FaPlusCircle />,
        cName: 'nav-text'
    },
    AdminSidebar
];



export const Sidebar = {
    VIEWER: ViewerSidebar,
    USER: UserSidebar,
    AUTHORITY: AuthoritySidebar,
    AUTHORITY_ADMIN: AuthorityAdminSidebar,
    MINTER: MinterSidebar,
    MINTER_ADMIN: MinterAdminSidebar,
    GARAGE: UserSidebar,
    DEFAULT_ADMIN: DefaultAdminSidebar
}