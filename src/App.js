import React, { useEffect } from "react";
import './styles/App.css';
import { useDispatch, useSelector } from "react-redux";
import { initApp, loadSmartContract, login, subscribeToChainEvents, updateAppAccount, updateAppNetwork } from "./redux/blockchain/blockchainActions";
import NormalView from "./components/views/NormalView";
import { fetchMyData } from "./redux/data/dataActions";

function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const app = useSelector((state) => state.app);

  useEffect(async () => {
    await dispatch(initApp())
    await dispatch(login())
  }, []);

  useEffect(async () => {
    if (app.initializedApp) {
      await dispatch(loadSmartContract())
    }
  }, [blockchain.currentNetwork])

  useEffect(() => {
    if (app.initializedApp) {
      dispatch(fetchMyData());
    }
  }, [blockchain.smartContract])

  if (blockchain.walletProvider) {
    window.ethereum.on("accountsChanged", (accounts) => {
      dispatch(updateAppAccount(accounts[0]));
      dispatch(fetchMyData());
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