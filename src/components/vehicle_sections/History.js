import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getVehicleHistory } from "../utils/BlockchainGateway";
import '../../styles/History.css';

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

        (blockchain.smartContracts)[1].getPastEvents(
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
            <div>
            Vehicle History:

            </div>
            <ul class="timeline">
                {vehicleHistory.map((owner, index) => {
                    return (
                        <li class="timeline-event">
                            <label class="timeline-event-icon"></label>
                            <div class="timeline-event-copy">
                                <p class="timeline-event-thumbnail">April 2011 - heute</p>
                                <h3>{owner}</h3>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default History;