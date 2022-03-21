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
import { Link, useHistory } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { IconButton, Stack } from '@mui/material';

import { useMediaQuery } from 'react-responsive';

/**
  * The main menu displayed at the top left.
  * Turns into a hamburger menu when the dimensions of the user's
  * view are too low.
  */
export default function MainMenu() {

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
    const [value, setValue] = React.useState(0)
    const history = useHistory();

    function handleChange(e) {
        var index = [...e.target.parentElement.children].indexOf(e.target)
        if (window.location.pathname != sidebar[index].path) {
            history.push(sidebar[index].path)
            setValue(index)
        }
    };


    React.useEffect(() => {
   
        for (var element of sidebar) {
            if (window.location.pathname == element.path) {
                setValue(sidebar.indexOf(element))
            }
        }

    }, [sidebar])


    const drawer = (anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {sidebar.map((item, index) => (
                    <ListItem button onClick={() => { history.push(item.path); }} key={index}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const greaterThan700 = useMediaQuery({ minWidth: 700 })


    return (


        <Stack direction="row" >


            <Drawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                {drawer('left')}
            </Drawer>


            {greaterThan700 ? <Box sx={{ maxWidth: { sm: 320, md: 480, lg: 640, xl: 800 }, bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {sidebar.map((item, index) => (
                        <Tab onClick={handleChange} key={index} label={item.title} />
                    ))}

                </Tabs>
            </Box> : <React.Fragment key={'left'}>
                <IconButton onClick={toggleDrawer('left', true)}>
                    <FaIcons.FaBars />
                </IconButton>
            </React.Fragment>}

        </Stack>
    );
}
