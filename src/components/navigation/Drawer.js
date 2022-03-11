import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as FaIcons from 'react-icons/fa';
import { getSidebarFor } from '../utils/Roles';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function TemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    var sidebar = getSidebarFor(data.myRole)

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {sidebar.map((item, index) => (
                    <ListItem button key={item.title}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <Link to={item.path}>
                          
                        </Link>
                        <ListItemText to={item.path} primary={item.title} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );


    
    return (
        <div>

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

            <React.Fragment key={'left'}>
                <FaIcons.FaBars onClick={toggleDrawer('left', true)} />
                <Drawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                >
                    {list('left')}
                </Drawer>
            </React.Fragment>

        </div>
    );
}
