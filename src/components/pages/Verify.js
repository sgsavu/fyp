import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import SearchFilter from '../filters/SearchFilter';
import { Link } from 'react-router-dom';

function Verify() {

  const data = useSelector((state) => state.data);
  let vehicleList = data.allVehicles

  const [pool, setPool] = useState([])
  const [backupPool, setBackupPool] = useState([])

  useEffect(() => {
    
  }, [])
  
  
  return (
    <div>
      <SearchFilter pool={Object.values(vehicleList)} modifier={setPool} reset={[]} />
      <div>
        {
          pool.slice(0, 15).map((value, key) => {
          return (
            <Link key={key} to={{
              pathname: "/vehicle",
              state: { metadata: value },
            }}>
              <p>{value.attributes.vhcid} </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Verify;