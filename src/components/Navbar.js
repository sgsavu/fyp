import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';

import '../styles/Navbar.css';
import { IconContext } from 'react-icons';
import { useSelector } from "react-redux";
import { getSidebarFor } from '../pages/PermissionsAndRoles';

function Navbar() {
  const data = useSelector((state) => state.data);
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);
  const sidebar = getSidebarFor(data.myRole)

  return (
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={toggleVisibility} />
          </Link>
        </div>
        <nav className={visible ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={toggleVisibility}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {sidebar.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
  );
}

export default Navbar;