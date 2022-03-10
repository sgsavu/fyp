import React from "react";
import '../../styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { addOrSwitchNetwork, updateAppNetwork } from "../../redux/blockchain/blockchainActions";




function SelectNetwork() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const changeNetwork = async (newNetwork) => {
        if (blockchain.walletProvider)
            await addOrSwitchNetwork(newNetwork)
        else
            dispatch(updateAppNetwork(newNetwork))
    }

    return (
        <div>
            
            <select defaultValue={blockchain.currentNetwork} onChange={(e) => changeNetwork(e.target.value)}>
                {
                    blockchain.networkTables ?
                        Object.keys(blockchain.networkTables.networks).map(key => {
                            if (key == blockchain.currentNetwork)
                                return (
                                    <option selected key={key} value={key}>
                                        {blockchain.networkTables.networks[key].chainName}
                                    </option>
                                )
                            else
                                return (
                                    <option key={key} value={key}>
                                        {blockchain.networkTables.networks[key].chainName}
                                    </option>
                                );
                        }) : null
                }
            </select>
        </div>
    );
}

export default SelectNetwork;