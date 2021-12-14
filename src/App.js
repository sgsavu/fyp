import React, { useEffect, useRef } from "react";
import './styles/App.css';

import { useDispatch, useSelector } from "react-redux";
import { initApp, loadSmartContract, updateAccount, updateAppNetwork} from "./redux/blockchain/blockchainActions";
import { fetchMyData, refresh} from "./redux/data/dataActions";
import Loading from "./Loading";
import Error from "./Error";
import NormalView from "./NormalView";
import Web3 from "web3";



function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const isInitialMount = useRef(true);
  const isInitialMount2 = useRef(true);
  const provider = blockchain.provider

  useEffect(() => {
    dispatch(initApp())
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      dispatch(loadSmartContract());
    }
  }, [blockchain.currentNetwork])

  useEffect(() => {
    if (isInitialMount2.current) {
      isInitialMount2.current = false;
    } else {
      dispatch(fetchMyData());
    }
  }, [blockchain.smartContract])

  window.ethereum.on("accountsChanged", (accounts) => {
    dispatch(updateAccount(accounts[0]));
  });
  
  window.ethereum.on("chainChanged", (chain) => {
    dispatch(updateAppNetwork(chain))
  });


  console.log(blockchain.loading)
  return (
    <div>
      {blockchain.loading.length != 0 ? <Loading /> : (blockchain.errorMsg ? <Error /> : 
      <NormalView />)}
    </div>
  );
}

export default App;