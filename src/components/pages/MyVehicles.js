import { Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import MiniCard from "../vehicle_sections/MiniCard";

function MyVehicles() {
  const data = useSelector((state) => state.data);
  const blockchain = useSelector((state) => state.blockchain);

  return (
    <Grid container padding={5} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 6, md: 12, xl: 18 }}>
      {Object.values(data.allVehicles).map((vehicle, index) => {
        if (vehicle.injected.owner == blockchain.account)
        return (
          <Grid item xs={4} sm={6} md={6} xl={6} key={index}>
            <MiniCard key={index} vehicle={vehicle}></MiniCard>
          </Grid>
        );
      })
      }
    </Grid>
  );
}

export default MyVehicles;