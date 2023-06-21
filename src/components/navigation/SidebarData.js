import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as GameIcons from 'react-icons/gi';
import * as BiIcons from "react-icons/bi";

const ViewerSidebar = [
    {
        title: 'Market',
        path: '/',
        icon: <BiIcons.BiStore />,
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
];

const GarageSidebar = [
    ...UserSidebar,
    {
        title: 'Garage',
        path: '/garage',
        icon: <GameIcons.GiMechanicGarage />,
        cName: 'nav-text'
    },
];

const AuthoritySidebar = [
    ...UserSidebar,
    {
        title: 'Verify',
        path: '/verify',
        icon: <AiIcons.AiOutlineFileSearch />,
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
        title: 'Mint',
        path: '/mint',
        icon: <FaIcons.FaPlusCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Verify',
        path: '/verify',
        icon: <AiIcons.AiOutlineFileSearch />,
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
    GARAGE: GarageSidebar,
    DEFAULT_ADMIN: DefaultAdminSidebar
}