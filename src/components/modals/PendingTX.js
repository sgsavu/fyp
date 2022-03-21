import React, { useEffect, useState } from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";

/**
  * The handling of the pending TX modals.
  */
function PendingTX() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    return (

        blockchain.pendingTx.length != 0 ? 
        <Snackbar open={true} >
            <Alert severity="info" sx={{ width: '100%' }}>
                {blockchain.pendingTx.length} transaction(s) pending...
            </Alert>
        </Snackbar> : null


    );
}

export default PendingTX;