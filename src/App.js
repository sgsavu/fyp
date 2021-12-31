import React, { useEffect, useRef } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { alerts, fetchAccounts, fetchProvider, initApp, loadSmartContract, login, updateAppAccount, updateAppNetwork, updateWeb3Provider } from "./redux/blockchain/blockchainActions";
import { fetchMyData, refresh } from "./redux/data/dataActions";
import NormalView from "./components/views/NormalView";
import { ALL_TEMPLATES } from "./components/utils/NetworkTemplates";


function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(async () => {
    await dispatch(initApp())
    //await dispatch(login())
  }, []);
 

  useEffect(async () => {
    if (blockchain.initFinished) {
      if (!blockchain.walletProvider)
        await dispatch(updateWeb3Provider(ALL_TEMPLATES[blockchain.currentNetwork].rpcUrls[0]))
      await dispatch(loadSmartContract());
    }
  }, [blockchain.currentNetwork])

  useEffect(() => {
    if (blockchain.initFinished) {
      if (blockchain.account || blockchain.walletProvider)
        dispatch(fetchMyData());
      else
        dispatch(refresh("SALE_VEHICLES"));
    }
  }, [blockchain.smartContract])

  if (blockchain.walletProvider)
  { 
    window.ethereum.on("accountsChanged", (accounts) => {
      dispatch(updateAppAccount(accounts[0]));
    });
  
    window.ethereum.on("chainChanged", (chain) => {
      dispatch(updateAppNetwork(chain))
    });
  }


  return (
    <div>
        <NormalView />
    </div>
  );
}

export default App;