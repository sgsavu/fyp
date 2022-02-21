import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { roles, actions, getAdminOptionsFor } from '../utils/PermissionsAndRoles';
import { burn, grantRole, revokeRole } from '../utils/BlockchainGateway';

const Admin = () => {

  const data = useSelector((state) => state.data);
  const { register, handleSubmit } = useForm();
  const myAdminOptions = getAdminOptionsFor(data.myRole)
  const [vehicleToBurn, setVehicleToBurn] = useState("")
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
      <input onChange={(e) => { setVehicleToBurn(e.target.value) }} value={vehicleToBurn} placeholder="Vehicle To Burn"></input>
      <button onClick={() => dispatch(burn(vehicleToBurn))}>Burn</button>
    </div>
  );
}

export default Admin;