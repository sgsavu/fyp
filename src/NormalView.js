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
import { fetchMyData, refreshVehiclesForSale } from "./redux/data/dataActions";

import ControlledRoute from './components/ControlledRoute';
import { roleToString } from "./utils/PermissionsAndRoles";
import Vehicle from "./pages/Vehicle";
import Support from "./pages/Support";
import Loading from "./Loading";
import Error from "./Error";
import Login from "./Login";
import SelectNetwork from "./SelectNetwork";

function NormalView() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    useEffect(() => {

    }, []);

    return (
        <div>
            <Login />
            <SelectNetwork />
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

export default NormalView;