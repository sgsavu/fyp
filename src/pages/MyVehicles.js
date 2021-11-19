import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as s from "../styles/globalStyles";
import "../styles/MyVehicles.css";
import { Link, Redirect } from 'react-router-dom';

function MyVehicles() {

  const data = useSelector((state) => state.data);
  return (
    <div>
      {data.loading ? (
        <p>loading...</p>
      ) : (
        data.myVehicles.map((nft, index) => {
          return (
            <div key={index} className="my-vehicle" onClick={(e) => { <Redirect push to="/vehicle" /> }}>
              <p>{nft.name}</p>
              <p>{nft.description}</p>
              <p>{nft.attributes[0].value}</p>
              <p>{nft.name}</p>
              <img
                alt={nft.name}
                src={nft.image}
                width={150}
              />
              <Link to={{
                pathname: "/vehicle",
                state: { metadata: nft },
              }}>
                <p>VIEW </p>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyVehicles;