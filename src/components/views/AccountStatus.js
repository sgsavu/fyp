import React from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/blockchain/blockchainActions";


function AccountStatus() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);


    return (
        <div>
            {blockchain.account? blockchain.account : <button onClick={() => {dispatch(login())}}>
                Login
            </button>}
          
        </div>
    );
}

export default AccountStatus;