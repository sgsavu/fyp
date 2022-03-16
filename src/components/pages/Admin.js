import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { roles, actions, getAdminOptionsFor } from '../utils/Roles';
import { callChainFunction } from '../utils/GatewayParser';
import { alerts } from '../../redux/app/appActions';
import Web3 from "web3";

const Admin = () => {

  const data = useSelector((state) => state.data);
  const { register, handleSubmit } = useForm();
  const myAdminOptions = getAdminOptionsFor(data.myRole)
  const [vehicleToBurn, setVehicleToBurn] = useState("")
  const [oddAddr, setOddAddr] = useState("")
  const [vehicleToOdd, setVehicleToOdd] = useState("")
  const dispatch = useDispatch();

  const onSubmit = (values) => {
    switch (values.action) {
      case actions.GIVE:
        dispatch(callChainFunction("grantRole", [roles[values.role], values.userAddress]))
        break;
      case actions.REVOKE:
        dispatch(callChainFunction("revokeRole", [roles[values.role], values.userAddress]))
        break;
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("userAddress")} placeholder="User Address" />
          <select {...register("action")}>
            {myAdminOptions.roleManaging.actions.map((action) => {
              return (
                <option key={action} value={action}>{action}</option>
              );
            })}
          </select>
          <select {...register("role")}>
            {Object.keys(myAdminOptions.roleManaging.roles).map((role) => {
              return (
                <option key={role} value={role}>{role}</option>
              );
            })}
          </select>
          <input type="submit" />
        </form>
      </div>
      {myAdminOptions.vehicleBurning? <div>
        <input onChange={(e) => { setVehicleToBurn(e.target.value) }} value={vehicleToBurn} placeholder="Vehicle To Burn"></input>
        <button onClick={() => {
          if (vehicleToBurn != "")
            dispatch(callChainFunction("burn", [vehicleToBurn]))
          else
            dispatch(alerts({ alert: "error", message: "Required fields not filled or address format incorrect." }))
        }}>Burn</button>
      </div> : null}
      
      {myAdminOptions.setOdometers ? <div>
        <input onChange={(e) => { setVehicleToOdd(e.target.value) }} value={vehicleToOdd} placeholder="VehicleID"></input>
        <input onChange={(e) => { setOddAddr(e.target.value) }} value={oddAddr} placeholder="Odometer Address"></input>
        <button onClick={() => {
          if (vehicleToOdd != "" && oddAddr != "" && Web3.utils.isAddress(oddAddr))
            dispatch(callChainFunction("setOdometerAddress", [vehicleToOdd, oddAddr]))
          else
            dispatch(alerts({ alert: "error", message: "Required fields not filled or address format incorrect." }))
        }}>Set Odometer</button>
      </div> : null}

    </div>
  );
}

export default Admin;