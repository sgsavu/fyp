import React from "react";
import '../../styles/App.css';

import IconButton from '@mui/material/IconButton';
import * as FiIcons from "react-icons/fi";
import { FormControlLabel, Menu, MenuItem, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { refreshDisplayPrices, updatePrefferedCurrency } from "../../redux/data/dataActions";
import Options from "../pages/Options";

/**
  * The triple dot vertical icon at the top right.
  * Simple Dialog menu used to display a few more extra options to the user
  * which are not that relevant as the main menu tabs.
  */
function More() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    const dispatch = useDispatch();
    const data = useSelector((state) => state.data);
    const myCurrency = data.displayCurrency
    const availableCurrencies = ["GBP", "USD", "EUR", "ETH", "BTC"]



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