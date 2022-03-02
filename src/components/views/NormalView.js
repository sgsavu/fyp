import React from "react";
import '../../styles/App.css';
import Navbar from '../navigation/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyVehicles from '../pages/MyVehicles';
import Marketplace from '../pages/Marketplace';
import Verify from '../pages/Verify';
import Mint from '../pages/Mint';
import Admin from '../pages/Admin';
import Options from '../pages/Options';
import MyBids from '../pages/MyBids';
import ControlledRoute from '../navigation/ControlledRoute';
import Vehicle from "../pages/Vehicle";
import Support from "../pages/Support";
import Error from "./Error";
import Loading from "./Loading";
import CustomModal from "./CustomModal";
import Garage from "../pages/Garage";
import Edit from "../pages/Edit";

function NormalView() {

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
                    <Route path='/garage' component={Garage} />
                    <ControlledRoute path='/admin' component={Admin} />
                    <ControlledRoute path='/edit' component={Edit} />
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