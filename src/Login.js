import React, { useEffect } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { loadSmartContract, login } from "./redux/blockchain/blockchainActions";




function Login() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    useEffect(() => {

    }, []);

    return (
        <div>
            {!blockchain.account ? (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(login());
                    }}
                >
                    Login
                </button>
            ) : null}
        </div>
    );
}

export default Login;