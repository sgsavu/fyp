import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";

const keccak256 = require('keccak256')

const actions = {
	GIVE: "Give",
	REVOKE: "Revoke",
}

const ADMIN_FOR_MINTER_OPTIONS = {
  actions: [actions.GIVE,actions.REVOKE],
  roles: ["MINTER_ROLE"]
}

const ADMIN_FOR_AUTHORITY_OPTIONS = {
  actions: [actions.GIVE,actions.REVOKE],
  roles: ["AUTHORITY_ROLE"]
}

const ADMIN_MASTER_OPTIONS = {
  actions: [actions.GIVE,actions.REVOKE],
  roles: ["AUTHORITY_ROLE","MINTER_ROLE","ADMIN_FOR_MINTER_ROLE","ADMIN_FOR_AUTHORITY_ROLE"]
}

const optionGiver = (myRole) => {
  switch (myRole){
    case "MINTER_ADMIN":
      return ADMIN_FOR_MINTER_OPTIONS
    case "AUTHORITY_ADMIN":
      return ADMIN_FOR_AUTHORITY_OPTIONS
    case "ADMIN":
      return ADMIN_MASTER_OPTIONS
  }
}

const Admin = () => {

  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  

  const myAdminOptions = optionGiver(data.role)

  async function grantRole(role, address) {
    console.log("giving",role,address)
    await blockchain.smartContract.methods
      .grantRole(keccak256(role), address)
      .send({ from: blockchain.account })

  };

  async function revokeRole(role, address) {
    await blockchain.smartContract.methods
      .revokeRole(keccak256(role), address)
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