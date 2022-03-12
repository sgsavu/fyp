import React from "react";
import '../../styles/App.css';

import IconButton from '@mui/material/IconButton';
import * as FiIcons from "react-icons/fi";

function More() {


    return (
        <IconButton size="small" aria-label="delete">
            <FiIcons.FiMoreHorizontal></FiIcons.FiMoreHorizontal>
        </IconButton>
    );
}

export default More;