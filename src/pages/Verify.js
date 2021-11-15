import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Filter from './Filter';

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
            <a key={key} href={value.image}>
              <p>{value.name} </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default Verify;