import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { roles, actions, getAdminOptionsFor } from '../utils/Roles';
import { callChainFunction } from '../utils/GatewayParser';
import { alerts } from '../../redux/app/appActions';
import Web3 from "web3";
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

const Admin = () => {

  const data = useSelector((state) => state.data);
  const { register, handleSubmit } = useForm();
  const myAdminOptions = getAdminOptionsFor(data.myRole)
  const dispatch = useDispatch();

  const [roleOption, setRoleOption] = useState("")
  const [roleSelected, setRoleSelected] = useState("")
  const [roleAddress, setRoleAddress] = useState("")

  const [vehicleToBurn, setVehicleToBurn] = useState("")

  const [oddAddr, setOddAddr] = useState("")
  const [vehicleToOdd, setVehicleToOdd] = useState("")

  const handleRole = () => {
    if (roleOption && roleSelected && roleAddress) {
      if (Web3.utils.isAddress(roleAddress)) {
        dispatch(callChainFunction(roleOption, [roles[roleSelected], roleAddress]))
      }
      else {
        dispatch(alerts({ alert: "error", message: "Address format invalid." }))
      }
    }
  }

  const handleBurn = () => {
    if (vehicleToBurn)
      dispatch(callChainFunction("burn", [vehicleToBurn]))
    else
      dispatch(alerts({ alert: "error", message: "Required fields not filled or address format incorrect." }))
  }

  const handleSetOdometer = () => {
    if (vehicleToOdd && oddAddr) {
      if (Web3.utils.isAddress(oddAddr)) {
        dispatch(callChainFunction("setOdometerAddress", [vehicleToOdd, oddAddr]))
      }
      else {
        dispatch(alerts({ alert: "error", message: "Required fields not filled or address format incorrect." }))

      }
    }
  }

  return (
    <Stack>
      <Stack direction="row" >
        <TextField value={roleAddress} onChange={(e) => { setRoleAddress(e.target.value) }} label="Address" variant="outlined" />
        <FormControl fullWidth>
          <InputLabel>Role Option</InputLabel>
          <Select
            value={roleOption}
            label="Role Option"
            onChange={(e) => { setRoleOption(e.target.value) }}
          >
            {myAdminOptions.roleManaging.actions.map((action) => {
              return (
                <MenuItem key={action} value={action}>{action}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleSelected}
            label="Role"
            onChange={(e) => { setRoleSelected(e.target.value) }}
          >
            {Object.keys(myAdminOptions.roleManaging.roles).map((role) => {
              return (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button onClick={handleRole} variant="contained">Submit</Button>
      </Stack>


      {myAdminOptions.vehicleBurning ?
        <Stack direction="row" >
          <TextField onChange={(e) => { setVehicleToBurn(e.target.value) }} value={vehicleToBurn} label="Vehicle ID" variant="outlined" />
          <Button onClick={handleBurn} variant="contained">Burn</Button>
        </Stack>
        : null}

      {myAdminOptions.setOdometers ?
        <Stack direction="row" >
          <TextField onChange={(e) => { setVehicleToOdd(e.target.value) }} value={vehicleToOdd} label="Vehicle ID" variant="outlined" />
          <TextField onChange={(e) => { setOddAddr(e.target.value) }} value={oddAddr} label="Odometer Address" variant="outlined" />
          <Button onClick={handleSetOdometer} variant="contained">Set</Button>
        </Stack>
        : null}

    </Stack>
  );
}

export default Admin;