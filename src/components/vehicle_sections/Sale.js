import React, { useState } from 'react';
import { useSelector } from "react-redux";
import SearchFilter from '../components/filters/SearchFilter';
import { Link } from 'react-router-dom';

function History() {

  const data = useSelector((state) => state.data);
  const vehicleList = data.allVehicles
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
     
    let vehicleHistory = await getVehicleHistory(vehicle.injected.id)
    setVehicleHistory(vehicleHistory)
      
  }, [])

  return (
    <div>
      
    </div>
  );
}

export default History;
