import React, { useEffect, useRef } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { initApp, loadSmartContract, updateAppAccount, updateAppNetwork, updateWeb3Provider } from "./redux/blockchain/blockchainActions";
import { fetchMyData, refresh } from "./redux/data/dataActions";
import Loading from "./components/views/Loading";
import Error from "./components/views/Error";
import NormalView from "./components/views/NormalView";
import { ALL_TEMPLATES } from "./components/utils/NetworkTemplates";


function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const provider = blockchain.provider

  useEffect(() => {
    dispatch(initApp())
  }, []);

  useEffect(async () => {
    if (blockchain.initFinished) {
      if (!blockchain.provider)
        await dispatch(updateWeb3Provider(ALL_TEMPLATES[blockchain.currentNetwork].rpcUrls[0]))
      await dispatch(loadSmartContract());
    }
  }, [blockchain.currentNetwork])

  useEffect(() => {
    if (blockchain.initFinished) {
      if (blockchain.account || blockchain.provider)
        dispatch(fetchMyData());
      else
        dispatch(refresh("SALE_VEHICLES"));
    }
  }, [blockchain.smartContract])

  if (provider)
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
      {blockchain.errorMsg ? <Error /> : (blockchain.loading.length != 0 ? <Loading /> :
        <NormalView />)}
    </div>
  );
}

export default App;