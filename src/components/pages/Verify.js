import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import SearchFilter from '../filters/Search';
import { Link } from 'react-router-dom';
import '../../styles/Verify.css';

function Verify() {

  const data = useSelector((state) => state.data);
  let vehicleList = data.allVehicles

  const [pool, setPool] = useState([])

  useEffect(() => {

  }, [])


  return (
    <div className='verify-main'>
      <div>
        <div>
          <SearchFilter pool={Object.values(vehicleList)} modifier={setPool} reset={[]} />
        </div>
        <div className='result-list'>
          <div>
            {pool.slice(0, 15).map((value, key) => {
              return (
                <div key={key} className=''>
                  <Link
                    className='result-card'
                    key={key}
                    to={{
                      pathname: "/vehicle",
                      state: { metadata: value },
                    }}>
                    <span className="result-id">{value.injected.id} </span>
                    <span className="result-vhcid">{value.attributes.vhcid}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;