import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getVehicleHistory } from "../utils/BlockchainGateway";

const History = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    const [vehicleHistory, setVehicleHistory] = useState([]);

    useEffect(async () => {

        const getVehicleHistory = (events) => {
            var vehicleHistory = []
            events.forEach(event => {
                vehicleHistory.push(event.returnValues.to)
            })
            setVehicleHistory(vehicleHistory)
        }
        
        blockchain.smartContract.getPastEvents(
            'Transfer',
            {
                filter: { tokenId: vehicle.injected.id },
                fromBlock: 0,
                toBlock: 'latest'
            },
            (err, events) => { 
                getVehicleHistory(events) 
            }
        )

    }, [data.myVehicles, data.allVehicles, data.saleVehicles])

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