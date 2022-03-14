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

    function handleChange(event, newValue) {
        history.push(sidebar[newValue].path)
        setValue(newValue)

    };

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



    return (


        <Stack direction="row">

            <React.Fragment key={'left'}>
                <IconButton onClick={toggleDrawer('left', true)}>
                    <FaIcons.FaBars />
                </IconButton>
            </React.Fragment>
            <Drawer
                anchor={'left'}
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                {drawer('left')}
            </Drawer>
            <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {sidebar.map((item, index) => (
                        <Tab key={index} label={item.title} />
                    ))}

                </Tabs>
            </Box>
        </Stack>
    );
}
