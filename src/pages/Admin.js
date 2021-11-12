import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useForm } from "react-hook-form";

const keccak256 = require('keccak256')


const Admin = () => {

  const blockchain = useSelector((state) => state.blockchain);


  async function grantRole(role, address) {

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
  const [result, setResult] = useState("");
  var obj = {}

  const onSubmit = (data) => {

    if (data["action"] == "give") {
      grantRole(data.role, data.userAddress)
    }
    else if (data['action'] == "revoke") {
      revokeRole(data.role, data.userAddress)
    }
  }

  return (
    <form onSubmit={

      handleSubmit(onSubmit)

    }>

      <input {...register("userAddress")} placeholder="User Address" />
      <select {...register("action")}>
        <option value="">Action...</option>
        <option value="give">Give Role</option>
        <option value="revoke">Revoke Role</option>
      </select>
      <select {...register("role")}>
        <option value="">Role...</option>
        <option value="MINTER_ROLE">Minter</option>
        <option value="AUTHORITY_ROLE">Authority</option>
        <option value="ADMIN_ROLE">Admin</option>
      </select>
      <p>{result}</p>
      <input type="submit" />
    </form>
  );
}

export default Admin;