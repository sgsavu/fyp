import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { roles, actions, getAdminOptionsFor } from '../utils/PermissionsAndRoles';
import { burn, grantRole, revokeRole, setOdometerAddress } from '../utils/BlockchainGateway';
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
        dispatch(grantRole(roles[values.role], values.userAddress))
        break;
      case actions.REVOKE:
        dispatch(revokeRole(roles[values.role], values.userAddress))
        break;
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("userAddress")} placeholder="User Address" />
          <select {...register("action")}>
            {myAdminOptions.actions.map((action) => {
              return (
                <option key={action} value={action}>{action}</option>
              );
            })}
          </select>
          <select {...register("role")}>
            {Object.keys(myAdminOptions.roles).map((role) => {
              return (
                <option key={role} value={role}>{role}</option>
              );
            })}
          </select>
          <input type="submit" />
        </form>
      </div>
      <div>
        <input onChange={(e) => { setVehicleToBurn(e.target.value) }} value={vehicleToBurn} placeholder="Vehicle To Burn"></input>
        <button onClick={() => {
          if (vehicleToBurn != "")
            dispatch(burn(vehicleToBurn))
          else
            dispatch(alerts({ alert: "error", message: "Required fields not filled or address format incorrect." }))
        }}>Burn</button>
      </div>
      <div>
        <input onChange={(e) => { setVehicleToOdd(e.target.value) }} value={vehicleToOdd} placeholder="VehicleID"></input>
        <input onChange={(e) => { setOddAddr(e.target.value) }} value={oddAddr} placeholder="Odometer Address"></input>
        <button onClick={() => {
          if (vehicleToOdd != "" && oddAddr != "" && Web3.utils.isAddress(oddAddr))
            dispatch(setOdometerAddress(vehicleToOdd, oddAddr))
          else
            dispatch(alerts({ alert: "error", message: "Required fields not filled or address format incorrect." }))
        }}>Set Odometer</button>
      </div>
    </div>
  );
}

export default Admin;