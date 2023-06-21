import React from "react";
import '../../styles/App.css';
import IconButton from '@mui/material/IconButton';
import * as FiIcons from "react-icons/fi";
import { Menu, MenuItem } from "@mui/material";
import Options from "../pages/Options";

function More() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small" aria-label="delete">
                <FiIcons.FiMoreHorizontal></FiIcons.FiMoreHorizontal>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
              <MenuItem >About</MenuItem>
                <MenuItem >
                    <Options>
                    </Options>
                </MenuItem>
                <MenuItem >Help</MenuItem>
            </Menu>
        </div>
    );
}

export default More;