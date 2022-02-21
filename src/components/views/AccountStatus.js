import React, { useEffect, useState } from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { login, signout } from "../../redux/blockchain/blockchainActions";
import { getNetworkExplorer } from "../utils/NetworkTemplates";

function AccountStatus() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const [explorerUrl, setExplorerUrl] = useState("")


    useEffect(() => {
        if(blockchain.currentNetwork)
            setExplorerUrl(getNetworkExplorer(blockchain.currentNetwork) + "address/" + blockchain.account)
      }, [blockchain.currentNetwork])

    return (
        <div>
            {blockchain.account ? <div className="address">
            <a  href={explorerUrl} target="_blank">{blockchain.account}</a>
                <button onClick={() => { dispatch(signout()) }}>
                    Disconnect
                </button>
            </div> : <button onClick={() => { dispatch(login()) }}>
                Login
            </button>}

        </div>
    );
}

export default AccountStatus;