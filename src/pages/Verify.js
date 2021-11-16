import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Filter from './Filter';
import { Link } from 'react-router-dom';

function Verify() {

  const data = useSelector((state) => state.data);
  const vehicleList = data.allVehicles
  const [filtered, setFiltered] = useState([]);

  console.log(filtered)

  return (
    <div>
      <Filter data={vehicleList} callback={setFiltered} empty_state={[]} />
      <div>
        {filtered.slice(0, 15).map((value, key) => {
          return (
            <Link key={key} to={{
              pathname: "/vehicle",
              state: { metadata: value },
            }}>
              <p>{value.name} </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Verify;