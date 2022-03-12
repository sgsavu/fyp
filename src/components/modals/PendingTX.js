import React, { useEffect, useState } from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";


function PendingTX() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const [pendingList, setPendingList] = useState([])

    useEffect(() => {
        if (blockchain.pendingTx)
            setPendingList(blockchain.pendingTx)
    }, [blockchain.pendingTx])


    return (

        pendingList.length != 0 ? 
        <Snackbar open={true} >
            <Alert severity="info" sx={{ width: '100%' }}>
                {pendingList.length} transaction(s) pending...
            </Alert>
        </Snackbar> : null


    );
}

export default PendingTX;