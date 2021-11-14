import React, { useEffect} from "react";
import './styles/App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyVehicles from './pages/MyVehicles';
import Marketplace from './pages/Marketplace';
import Verify from './pages/Verify';
import Mint from './pages/Mint';
import Admin from './pages/Admin';

import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";

import ControlledRoute from './components/ControlledRoute';
import { roleToString } from "./pages/PermissionsAndRoles";





function App() {


  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  console.log("MyRole:",roleToString(data.myRole))

  useEffect(() => {
    
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
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
          <ControlledRoute path='/' exact component={MyVehicles}/>
          <ControlledRoute path='/marketplace' component={Marketplace} />
          <ControlledRoute path='/verify' component={Verify} />
          <ControlledRoute path='/mint' component={Mint} />
          <ControlledRoute path='/admin' component={Admin} />
        </Switch>
      </Router> }
      
    
    </s.Screen>
  );
}

export default App;