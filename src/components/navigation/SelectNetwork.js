import React from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { addOrSwitchNetwork, updateAppNetwork } from "../../redux/blockchain/blockchainActions";


import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import * as FaIcons from "react-icons/fa";
import Link from '@mui/material/Link';
import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";



function SimpleDialog(props) {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const changeNetwork = async (newNetwork) => {
        if (blockchain.walletProvider)
            await addOrSwitchNetwork(newNetwork)
        else
            dispatch(updateAppNetwork(newNetwork))
    }

    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };


    const handleListItemClick = (value) => {
        onClose(value);
    };
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Choose a network</DialogTitle>
            <List sx={{ pt: 0 }}>
                {blockchain.networkTables ? Object.keys(blockchain.networkTables?.networks).map((kkey) => (
                    <ListItem button onClick={() => handleListItemClick(kkey)} key={kkey}>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 30, height: 30 }}
                                src={blockchain.networkTables.networks[kkey].image} >
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={blockchain.networkTables.networks[kkey].chainName} />
                    </ListItem>
                )) : null}
            </List>
        </Dialog>
    );
}

function SelectNetwork() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);


    const changeNetwork = async (newNetwork) => {
        if (blockchain.walletProvider)
            await addOrSwitchNetwork(newNetwork)
        else
            dispatch(updateAppNetwork(newNetwork))
    }

    const [open, setOpen] = React.useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if (value) {
            changeNetwork(value)
        }
    };



    return (
        <div>

            <Chip
                avatar={<Avatar src={blockchain.networkTables && blockchain.currentNetwork ? blockchain.networkTables.networks[blockchain.currentNetwork].image : null} />}
                label={<Box display={{xs: "none", sm: "block"}} >{blockchain.networkTables && blockchain.currentNetwork ? blockchain.networkTables.networks[blockchain.currentNetwork].chainName : "null"}</Box>   }
                variant="outlined"
                onClick={handleClickOpen}
            />

            <SimpleDialog
                open={open}
                onClose={handleClose}
            />


        </div>
    );
}

export default SelectNetwork;