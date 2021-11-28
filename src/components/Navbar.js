import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import '../styles/Navbar.css';
import { IconContext } from 'react-icons';
import { getSidebarFor } from '../utils/PermissionsAndRoles';
import { fetchAllData, refresh } from '../redux/data/dataActions';
import { MyBids } from './SidebarData';

function Navbar() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const blockchain = useSelector((state) => state.blockchain);
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);
  var sidebar = getSidebarFor(data.myRole)

  if (data.myBids.length!=0)
    sidebar = [...sidebar,MyBids]

  const refreshData = () => {
    switch (window.location.pathname)
    {
      case "/marketplace":
        dispatch(refresh("FORSALE_VEHICLES"))
        break;
      case "/":
        dispatch(refresh("MY_VEHICLES"))
        break;
      case "/verify": 
        dispatch(refresh("ALL_VEHICLES"))
        break;
      case "/vehicle":
        dispatch(fetchAllData(blockchain.account))
        break;
    }
  }

  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <div className='navbar'>
        <FaIcons.FaBars className='menu-bars' onClick={toggleVisibility} />
        <IoIcons.IoMdRefresh className='refresh' onClick={refreshData} />
      </div>
      <nav className={visible ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={toggleVisibility}>
          <li className='navbar-toggle'>
            <AiIcons.AiOutlineClose className='menu-bars' />
          </li>
          {sidebar.map((item, index) => {
            if (item.path=="/mybids")
              if (data.myBids.length==0)
                console.log("bruh")
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