import { FormControl, Grid, InputLabel, MenuItem, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAccount } from '../../redux/reduxUtils';
import { callChainFunction, callViewChainFunction } from '../utils/GatewayParser';
import { roles } from '../utils/Roles';
import MiniCard from '../vehicle_sections/MiniCard';
import { default as Select2 } from "@mui/material/Select";
import { alerts } from '../../redux/app/appActions';

const Garage = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [address, setAddress] = useState("")
    const [vehicle, setVehicle] = useState("")

    function handleSelect (e) {
        setVehicle(e.target.value)
    }

    async function approve() {
        if (vehicle!="" && address != "")
        {
            dispatch(await callChainFunction("setApprovedGarage", [vehicle, address]))
        }
        else {
            dispatch(alerts({ alert: "error", message: "Required fields not filled or address format incorrect." }))
        }
    }
    return (
        <div>
            {data.myRole == roles.GARAGE_ROLE ?
                <Grid container padding={5} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {Object.values(data.allVehicles).map((vehicle, index) => {
                        if (vehicle.injected.garage == blockchain.account)
                            return (
                                <Grid item xs={2} sm={4} md={4} key={index}>
                                    <MiniCard key={index} vehicle={vehicle}></MiniCard>
                                </Grid>
                            );
                    })}
                </Grid>
                : <div>
                    <Stack width={100} direction="row" >
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
                            <InputLabel>Choose vehicle:</InputLabel>
                            <Select2
                                size="x"
                                value={vehicle}
                                label="Per Page"
                                onChange={handleSelect}
                            >
                                {Object.keys(data.allVehicles).map((value, index) => {
                                    if (data.allVehicles[value].injected.owner == blockchain.account) {
                                        return <MenuItem key={value} value={value}>{value}</MenuItem>
                                    }
                                })}
                            </Select2>
                        </FormControl>
                        <TextField  label="Outlined" variant="outlined" />
                        <input onChange={(e) => { setAddress(e.target.value) }} placeholder='Address' value={address}></input>
                        <button onClick={approve}>Approve</button>
                    </Stack>
                   
                </div>}
        </div>
    );
}

export default Garage;