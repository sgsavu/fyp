import React, { useEffect, useState, useRef } from "react";
import './styles/App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyVehicles from './pages/MyVehicles';
import Marketplace from './pages/Marketplace';
import Verify from './pages/Verify';
import Mint from './pages/Mint';

import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { create } from "ipfs-http-client";
import * as s from "./styles/globalStyles";
import styled from "styled-components";




function App() {


  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");


  useEffect(() => {
    
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      console.log("bruh")
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
        <Navbar />
        <Switch>
          <Route path='/' exact component={MyVehicles} />
          <Route path='/marketplace' component={Marketplace} />
          <Route path='/verify' component={Verify} />
          <Route path='/mint' component={Mint} />
        </Switch>
      </Router> }
      
    
    </s.Screen>
  );
}

export default App;