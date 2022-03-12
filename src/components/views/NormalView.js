import React from "react";
import '../../styles/App.css';
import Navbar from '../navigation/Navbar';
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
import TemporaryDrawer from "../navigation/Drawer";
import AccountStatus from "../navigation/AccountStatus";
import PendingTX from "../modals/PendingTX";
import SelectNetwork from "../navigation/SelectNetwork";

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import * as FiIcons from "react-icons/fi";
import More from "../navigation/More";
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDispatch, useSelector } from "react-redux";
import { getSidebarFor } from "../utils/Roles";

function NormalView() {

 
    const data = useSelector((state) => state.data);
  

    
    

    return (
        <div>
            <Router>

                <Stack direction="row" justifyContent="space-between" >

                    
                        <TemporaryDrawer></TemporaryDrawer>
                    
                    
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