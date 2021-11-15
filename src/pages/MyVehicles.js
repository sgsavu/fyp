import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as s from "../styles/globalStyles";


function MyVehicles() {

  const data = useSelector((state) => state.data);

  return (
    <div>
      {data.loading ? (
        <p>loading...</p>
      ) : (
        data.myVehicles.map((nft, index) => {
          return (
            <div key={index} style={{ padding: 16 }}>
              <p>{nft.name}</p>
              <p>{nft.description}</p>
              <p>{nft.attributes[0].value}</p>
              <p>{nft.name}</p>
              <img
                alt={nft.name}
                src={nft.image}
                width={150}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyVehicles;