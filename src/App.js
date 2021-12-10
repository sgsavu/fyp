import React, { useEffect } from "react";
import './styles/App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyVehicles from './pages/MyVehicles';
import Marketplace from './pages/Marketplace';
import Verify from './pages/Verify';
import Mint from './pages/Mint';
import Admin from './pages/Admin';
import Options from './pages/Options';
import MyBids from './pages/MyBids';
import { useDispatch, useSelector } from "react-redux";
import { initializeWallet, loadSmartContract, loadWeb3Provider } from "./redux/blockchain/blockchainActions";
import { fetchAllData, refreshVehiclesForSale } from "./redux/data/dataActions";

import ControlledRoute from './components/ControlledRoute';
import { roleToString } from "./utils/PermissionsAndRoles";
import Vehicle from "./pages/Vehicle";
import Support from "./pages/Support";





function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(() => {

    if (!blockchain.account && !blockchain.smartContract) {
      dispatch(initializeWallet());
    }
    
  }, []);

  return (
    <div>
      {blockchain.account === "" || blockchain.smartContract === null ? (

        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(loadSmartContract());
          }}
        >
          Login
        </button>
      ) : null}
      {blockchain.errorMsg !== "" ? (
        <p>{blockchain.errorMsg}</p>
      ) : null}
      <Router>
        <Navbar>
        </Navbar>
        <Switch>
          <ControlledRoute path='/' exact component={MyVehicles} />
          <ControlledRoute path='/marketplace' component={Marketplace} />
          <ControlledRoute path='/verify' component={Verify} />
          <ControlledRoute path='/mint' component={Mint} />
          <ControlledRoute path='/admin' component={Admin} />
          <Route path='/vehicle' component={Vehicle} />
          <Route path='/options' component={Options} />
          <Route path='/mybids' component={MyBids} />
          <Route path='/support' component={Support} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;