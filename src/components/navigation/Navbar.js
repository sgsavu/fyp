import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { IconContext } from 'react-icons';
import { getSidebarFor } from '../utils/Roles';
import SelectNetwork from './SelectNetwork';
import AccountStatus from './AccountStatus';
import PendingTX from '../modals/PendingTX';

function Navbar() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const blockchain = useSelector((state) => state.blockchain);
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);
  var sidebar = getSidebarFor(data.myRole)

  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <div className='navbar'>
        <div>
          <FaIcons.FaBars className='menu-bars' onClick={toggleVisibility} />
        </div>
        <div>
          <AccountStatus />
          <SelectNetwork />
          <PendingTX />
        </div>
      </div>
      <nav className={visible ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={toggleVisibility}>
          <li className='navbar-toggle'>
            <AiIcons.AiOutlineClose className='menu-bars' />
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