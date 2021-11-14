import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { roles, actions, getAdminOptionsFor} from './PermissionsAndRoles';
import web3 from 'web3';

const keccak256 = require('keccak256')

const Admin = () => {

  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const { register, handleSubmit } = useForm();
  const myAdminOptions = getAdminOptionsFor(data.myRole)

  async function grantRole(role, address) {
    await blockchain.smartContract.methods
      .grantRole(role, address)
      .send({ from: blockchain.account })
  };

  async function revokeRole(role, address) {
    await blockchain.smartContract.methods
      .revokeRole(role, address)
      .send({ from: blockchain.account })
  }

  const onSubmit = (values) => {
    switch (values.action){
      case actions.GIVE:
        grantRole(roles[values.role], values.userAddress)
        break;
      case actions.REVOKE:
        revokeRole(roles[values.role], values.userAddress)
        break;
      default:
        console.log('bruh')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("userAddress")} placeholder="User Address" />
      <select {...register("action")}>
        <option value="">Action...</option>
        {myAdminOptions.actions.map((action) => {
          return (
            <option key={action} value={action}>{action}</option>
          );
        })}
      </select>
      <select {...register("role")}>
        <option value={roles.MINTER_ROLE_ADMIN}>Role...</option>
        {myAdminOptions.roles.map((role) => { 
          return (
            <option key={role} value={role}>{role}</option>
          );
        })}
      </select>
      <input type="submit" />
    </form>
  );
}

export default Admin;