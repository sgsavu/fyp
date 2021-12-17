import React from "react";
import '../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { addChain, updateAppNetwork } from "../redux/blockchain/blockchainActions";
import { ALL_TEMPLATES } from "./utils/NetworkTemplates";




function SelectNetwork() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const changeNetwork = async (newNetwork) => {
        if (blockchain.account || blockchain.provider)
            await addChain(newNetwork)
        else
            dispatch(updateAppNetwork(newNetwork))
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