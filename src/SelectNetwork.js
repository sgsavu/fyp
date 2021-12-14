import React, { useEffect } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { loadSmartContract, updateState, updateNetwork, addChain } from "./redux/blockchain/blockchainActions";
import Web3 from "web3";
import { ALL_TEMPLATES } from "./utils/NetworkTemplates";




function SelectNetwork() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    useEffect(() => {

    }, []);
    const changeNetwork = async (newNetwork) => {
        await addChain(newNetwork)
    }
    return (
        <div>
            <select defaultValue={blockchain.currentNetwork} onChange={(e) => changeNetwork(e.target.value)}>
                {
                    blockchain.availableNetworks ?
                        Object.keys(blockchain.availableNetworks).map(key => {
                            
                                return (
                                    <option key={key} value={key}>
                                        {ALL_TEMPLATES[key].chainName}
                                    </option>
                                );
                        }) : null
                }
            </select>
        </div>
    );
}

export default SelectNetwork;