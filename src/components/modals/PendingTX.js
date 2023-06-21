import React from "react";
import { useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import '../../styles/App.css';

function PendingTX() {
    const blockchain = useSelector(state => state.blockchain)

    return (
        blockchain.pendingTx.length !== 0 ? 
        <Snackbar open={true} >
            <Alert severity="info" sx={{ width: '100%' }}>
                {blockchain.pendingTx.length} transaction(s) pending...
            </Alert>
        </Snackbar> : null
    );
}

export default PendingTX;