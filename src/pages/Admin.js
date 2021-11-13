import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { actions, getAdminPanelPermissions } from './Permissions';

const Admin = () => {

  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  

  const myAdminOptions = getAdminPanelPermissions(data.role)

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

  const { register, handleSubmit } = useForm();

  const onSubmit = (values) => {

    if (values["action"] == actions.GIVE) {
      grantRole(values.role, values.userAddress)
    }
    else if (values['action'] == actions.REVOKE) {
      revokeRole(values.role, values.userAddress)
    }
  }

  return (
    <form onSubmit={
      handleSubmit(onSubmit)
    }>
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
        <option value="">Role...</option>
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