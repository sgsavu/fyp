import React, { useEffect } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { init, loadSmartContracts, login, updateAppAccount, updateAppNetwork } from "./redux/blockchain/blockchainActions";
import NormalView from "./components/views/NormalView";
import { fetchMyData } from "./redux/data/dataActions";
import { useState } from "react";

function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const app = useSelector((state) => state.app);
  const [first, setfirst] = useState("")

  useEffect(async () => {
    await dispatch(init())
    await dispatch(login())
  }, []);

  useEffect(async () => {
    if (app.initializedApp) {
      await dispatch(loadSmartContracts())
    }
  }, [blockchain.currentNetwork])

  useEffect(() => {
    if (app.initializedApp) {
      dispatch(fetchMyData());
    }
  }, [blockchain.smartContracts])

  useEffect(() => {
    if (first!="")
    {
      dispatch(updateAppAccount(first));
      dispatch(fetchMyData());
    }
  }, [first])
  

  if (blockchain.walletProvider) {
    window.ethereum.on("accountsChanged", (accounts) => {
      setfirst(accounts[0])
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