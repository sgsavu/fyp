import React from "react";
import '../../styles/App.css';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import MyVehicles from '../pages/MyVehicles';
import Marketplace from '../pages/Marketplace';
import Verify from '../pages/Verify';
import Mint from '../pages/Mint';
import Admin from '../pages/Admin';
import Options from '../pages/Options';
import ControlledRoute from '../navigation/ControlledRoute';
import Vehicle from "../pages/Vehicle";
import Support from "../pages/Support";
import Error from "../modals/Error";
import Loading from "../modals/Loading";
import CustomModal from "../modals/CustomModal";
import Garage from "../pages/Garage";
import Edit from "../pages/Edit";
import MainMenu from "../navigation/MainMenu";
import AccountStatus from "../navigation/AccountStatus";
import PendingTX from "../modals/PendingTX";
import SelectNetwork from "../navigation/SelectNetwork";

import Stack from '@mui/material/Stack';
import More from "../navigation/More";

import { useDispatch, useSelector } from "react-redux";

function NormalView() {


    const data = useSelector((state) => state.data);





    return (
        <div>
            <Router>

                <Stack margin={1} direction="row" justifyContent="space-between" >
                    <MainMenu></MainMenu>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SelectNetwork></SelectNetwork>
                        <AccountStatus></AccountStatus>
                        <More></More>
                    </Stack>
                </Stack>

            


                <PendingTX></PendingTX>
                <Error></Error>
                <CustomModal></CustomModal>
                <Loading></Loading>

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
                    <Route path='/support' component={Support} />
                </Switch>
            </Router>
        </div>
    );
}

export default NormalView;