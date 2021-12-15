import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/MyVehicles.css";
import VehicleCard from "../vehicle_sections/VehicleCard";

function MyVehicles() {

  const data = useSelector((state) => state.data);
  const vehicleList = data.myVehicles

  useEffect(() => {
  
  }, [vehicleList])

  return (
    <div>
      {data.loading.length!=0 ? (
        <p>loading...</p>
      ) : (
        vehicleList.map((vehicle, index) => {
          return (
            <VehicleCard key={index} vehicle={vehicle}/>
          );
        })
      )}
    </div>
  );
}

export default MyVehicles;