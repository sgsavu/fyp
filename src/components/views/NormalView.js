import React from "react";
import '../../styles/App.css';
import Navbar from '../Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyVehicles from '../pages/MyVehicles';
import Marketplace from '../pages/Marketplace';
import Verify from '../pages/Verify';
import Mint from '../pages/Mint';
import Admin from '../pages/Admin';
import Options from '../pages/Options';
import MyBids from '../pages/MyBids';
import ControlledRoute from '../ControlledRoute';
import Vehicle from "../pages/Vehicle";
import Support from "../pages/Support";
import SelectNetwork from "../SelectNetwork";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/blockchain/blockchainActions";
import Error from "./Error";
import Modal from "./Modal";
import Loading from "./Loading";
import CustomModal from "./CustomModal";


function NormalView() {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);


    return (
        <div>
            <Error></Error>
            <CustomModal></CustomModal>
            <Loading></Loading>
            <Router>
                <Navbar>
                </Navbar>
                <Switch>
                    <ControlledRoute path='/myvehicles' component={MyVehicles} />
                    <ControlledRoute path='/' exact component={Marketplace} />
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