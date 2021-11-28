import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getVehicleHistory } from "../../redux/blockchain/blockchainUtils";

const History = ({vehicle}) => {

    const data = useSelector((state) => state.data);
    const [vehicleHistory, setVehicleHistory] = useState([]);

    useEffect(async () => {
        let vehicleHistory = await getVehicleHistory(vehicle.injected.id)
        setVehicleHistory(vehicleHistory)
    }, [data.myVehicles,data.allVehicles,data.vehiclesForSale])

    return (
        <div>
            Vehicle History:
            {vehicleHistory.map((owner, index) => {
                return (
                    <div key={owner, index}>
                        <p>{owner}</p>
                    </div>
                )
            })}
        </div>
    );
}

export default History;