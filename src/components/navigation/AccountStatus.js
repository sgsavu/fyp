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
import { useHistory } from "react-router-dom";
import { formatAccountAddress } from "../utils/Other";

/**
  * Dialog which opens when the user is not connect. It allows the user
  * to authenticate through a list of available web3 wallets.
  */
function NotConnectedDialog(props) {
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
/**
  * Dialog which opens when the user is connected. It displays
  * information about the user's account and the option to disconnect.
  */
function ConnectedDialog(props) {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const { onClose, open } = props;
    const [explorerUrl, setExplorerUrl] = useState("")
    const history = useHistory();

    function disconnect() {
        history.push("/")
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

            <Stack spacing={1} padding={5} display="flex" alignItems="center" justifyContent="center" direction="column" >


                <Avatar src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" >
                </Avatar>

                <ListItemText primary={formatAccountAddress(blockchain.account)} />
                <Link
                    variant="body2"
                    rel="noopener"
                    href={explorerUrl}
                    target="_blank"
                >
                    <FaIcons.FaExternalLinkAlt></FaIcons.FaExternalLinkAlt> View on Explorer
                </Link>






            </Stack>
            <Button size="small" variant="contained" onClick={disconnect}>Disconnect</Button>

        </Dialog>
    );
}

/**
  * Component chip seen at the top of the page which displays the current status of users.
  * Authenticated/Unauthenticated
  */
function AccountStatus() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

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

            <NotConnectedDialog
                open={open1}
                onClose={() => setOpen1(false)}
            />

            <ConnectedDialog
                open={open2}
                onClose={() => setOpen2(false)}
            />

        </div>
    );
}

export default AccountStatus;