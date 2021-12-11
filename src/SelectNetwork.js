import React, { useEffect } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { loadSmartContract,updateState, updateNetwork, forceUserToChange } from "./redux/blockchain/blockchainActions";
import Web3 from "web3";




function SelectNetwork() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    useEffect(() => {

    }, []);

    const changeNetwork = (newNetwork) => {

        //if wallet switch wtih wallet otherwise switch with internal
        if (blockchain.account)
            dispatch(forceUserToChange(newNetwork))
        else
            dispatch(updateNetwork(Web3.utils.numberToHex(newNetwork)))
    }

    return (
        <div>
            <select onChange={(e) => changeNetwork(e.target.value)}>
                <option value={blockchain.currentNetwork.chain_id}>{blockchain.currentNetwork.chain_id}</option>
                {
                    blockchain.availableNetworks.map(element => {
                        if (blockchain.currentNetwork != element)
                        return (
                            <option key={element.chain_id} value={element.chain_id}>
                                {element.chain_id}
                            </option>
                        );
                    })
                }
            </select>
        </div>
    );
}

export default SelectNetwork;