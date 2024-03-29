import React, { useState } from 'react';
import { useSelector } from "react-redux";
import SearchFilter from '../filters/Search';
import { useHistory } from 'react-router-dom';
import { Paper, Stack } from '@mui/material';

function Verify() {

  const data = useSelector((state) => state.data);
  let vehicleList = data.allVehicles

  const [pool, setPool] = useState([])

  const history = useHistory()

  return (
    <Stack  display="flex" alignItems="center" justifyContent="center" >
      <SearchFilter pool={Object.values(vehicleList)} modifier={setPool} reset={[]} />
      <Stack
        spacing={3}
        width={{xs:"80%",sm:"40%"}}
      >
        {pool.slice(0, 15).map((value, key) => {
          return (
            <Paper
              key={key}
              onClick={() => {
                history.push({
                  pathname: "/vehicle",
                  state: { metadata: value }
                })
              }} >
              <Stack padding={2}  direction="row" justifyContent="space-between" alignItems="center">
                <p >{value.injected.id} </p>
                <p >{value.attributes.vhcid}</p>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default Verify;