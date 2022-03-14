import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MiniCard from "../vehicle_sections/MiniCard";

function MyVehicles() {

  const data = useSelector((state) => state.data);
  const app = useSelector((state) => state.app);
  const vehicleList = Object.values(data.myVehicles)

  return (


    <Grid container padding={5} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      {vehicleList.map((vehicle, index) => {
        return (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <MiniCard key={index} vehicle={vehicle}></MiniCard>
          </Grid>

        );
      })
      }
    </Grid>

  );
}

export default MyVehicles;