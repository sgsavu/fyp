import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/MyVehicles.css";
import VehicleCard from "../vehicle_sections/MiniCard";

function MyVehicles() {

  const data = useSelector((state) => state.data);
  const app = useSelector((state) => state.app);
  const vehicleList = Object.values(data.myVehicles)

  return (
    <div className="cards">
      {vehicleList.map((vehicle, index) => {
          return (
            <VehicleCard key={index} vehicle={vehicle}></VehicleCard>
          );
        })
      }
    </div>
  );
}

export default MyVehicles;