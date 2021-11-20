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

import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchAllData, refreshVehiclesForSale } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";

import ControlledRoute from './components/ControlledRoute';
import { roleToString } from "./pages/PermissionsAndRoles";
import Vehicle from "./pages/Vehicle";





function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(() => {

    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchAllData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);
  return (

    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <s.StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </s.StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : <Router>
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
        </Switch>
      </Router>}


    </s.Screen>
  );
}

export default App;