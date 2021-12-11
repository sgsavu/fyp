import React, { useEffect, useRef } from "react";
import './styles/App.css';

import { useDispatch, useSelector } from "react-redux";
import { initializeWallet, loadNetworks, loadSmartContract, loadWeb3Provider, login, updateAccount, updateNetwork} from "./redux/blockchain/blockchainActions";
import { refresh} from "./redux/data/dataActions";
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


  window.ethereum.on("accountsChanged", () => {
    dispatch(updateAccount(Web3.utils.toChecksumAddress(window.ethereum.selectedAddress)));
  });
  window.ethereum.on("chainChanged", (chain) => {
    console.log("chain changed",chain)
    dispatch(updateNetwork(chain))
  });


  useEffect(() => {

    console.log('init')

    
    dispatch(loadWeb3Provider())
    dispatch(loadNetworks())
    

    


  }, []);

  useEffect(() => {

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      console.log("network change")
      dispatch(loadSmartContract())
    }

  }, [blockchain.currentNetwork])


  useEffect(() => {

    if (isInitialMount2.current) {
      isInitialMount2.current = false;
    } else {
      console.log("davhielcs")
      dispatch(refresh("FORSALE_VEHICLES"));
    }

  }, [blockchain.smartContract])

  return (
    <div>
      {blockchain.loading === true ? <Loading /> : (blockchain.errorMsg ? <Error /> : 
      
      /*
      blockchain.account? (
        <div>
          </div>) :

          */
      
      <NormalView />)}
    </div>
  );
}

export default App;