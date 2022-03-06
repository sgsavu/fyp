import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/History.css';

const History = ({ vehicle }) => {

    const data = useSelector((state) => state.data);
    const blockchain = useSelector((state) => state.blockchain);
    const [vehicleHistory, setVehicleHistory] = useState({});

    useEffect(async () => {

        const getVehicleHistory = async (events) => {
            var vehicleHistory = {}

            for (var event of events) {
                var timestamp = (await blockchain.web3.eth.getBlock(event.blockHash)).timestamp
                vehicleHistory[timestamp] = {}
                vehicleHistory[timestamp].from = event.returnValues.from
                vehicleHistory[timestamp].to = event.returnValues.to
            }
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


    function getDate(timestamp) {
        var date = new Date(timestamp * 1000)
        return date.toLocaleString()
    }

    return (
        <div>
            <div>
                Vehicle History:
            </div>

            <ul class="timeline">
                {Object.keys(vehicleHistory).map((time, index) => {
                    return (
                        <li key={index} class="timeline-event">
                            <label class="timeline-event-icon"></label>
                            <div class="timeline-event-copy">
                                <p class="timeline-event-thumbnail">{getDate(time)}</p>
                                <h3>{vehicleHistory[time]?.to}</h3>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default History;