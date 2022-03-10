import React, { useEffect, useState } from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";


function PendingTX() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const [pendingList, setPendingList] = useState([])

    useEffect(() => {
        if(blockchain.pendingTx)
            setPendingList(blockchain.pendingTx)
      }, [blockchain.pendingTx])


    return (
        <div className="pending">
            {pendingList.length!=0?  pendingList.length + " pending..." : null }
        </div>
    );
}

export default PendingTX;