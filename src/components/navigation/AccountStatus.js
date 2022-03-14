import React, { useEffect, useState } from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { login, signout } from "../../redux/blockchain/blockchainActions";
import { getNetworkExplorer } from "../utils/GatewayParser";

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
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'


function SimpleDialog(props) {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    const { onClose, open } = props;

    useEffect(() => {
        onClose()
    }, [blockchain.account])


    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Connect a wallet</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem button onClick={() => { dispatch(login()) }} key={"bruh"}>
                    <ListItemAvatar>
                        <Avatar src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" >
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Metamask Wallet" />
                </ListItem>
            </List>
        </Dialog>
    );
}


function SimpleDialog2(props) {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const { onClose, open } = props;
    const [explorerUrl, setExplorerUrl] = useState("")


    function disconnect() {
        onClose()
        dispatch(signout())
    }


    useEffect(async () => {
        if (blockchain.currentNetwork)
            setExplorerUrl((await getNetworkExplorer(blockchain.currentNetwork)) + "address/" + blockchain.account)
    }, [blockchain.currentNetwork, blockchain.account])


    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Account</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem key={"bruh"}>
                    <ListItemAvatar>
                        <Avatar src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" >
                        </Avatar>
                    </ListItemAvatar>

                    <Stack direction="row" spacing={1} >

                    </Stack>
                    <ListItemText primary={formatAccountAddress(blockchain.account)} />
                    <Link

                        variant="body2"
                        rel="noopener"
                        href={explorerUrl}
                        target="_blank"
                    >
                        <FaIcons.FaExternalLinkAlt></FaIcons.FaExternalLinkAlt> View on Explorer
                    </Link>
                    <Button size="small" variant="contained" onClick={disconnect}>Disconnect</Button>

                </ListItem>
            </List>
        </Dialog>
    );
}

function formatAccountAddress(address) {
    if (address) {
        var length = address.length
        return address.slice(0, 6) + "..." + address.slice(length - 4, length)
    }
}

function AccountStatus() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const [explorerUrl, setExplorerUrl] = useState("")

    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    useEffect(async () => {
        if (blockchain.currentNetwork)
            setExplorerUrl((await getNetworkExplorer(blockchain.currentNetwork)) + "address/" + blockchain.account)
    }, [blockchain.currentNetwork, blockchain.account])


    function openDialog() {
        if (blockchain.account) {
            setOpen2(true)
        }
        else {
            setOpen1(true)
        }
    }



    return (
        <div>

            <Chip
                avatar={blockchain.account ?
                    <Avatar>
                        <Jazzicon seed={jsNumberForAddress(blockchain.account)} />
                    </Avatar> : null}
                label={blockchain.account ? formatAccountAddress(blockchain.account) : "Connect Wallet"}
                variant="outlined"
                onClick={openDialog}
            />

            <SimpleDialog
                open={open1}
                onClose={() => setOpen1(false)}
            />

            <SimpleDialog2
                open={open2}
                onClose={() => setOpen2(false)}
            />

        </div>
    );
}

export default AccountStatus;